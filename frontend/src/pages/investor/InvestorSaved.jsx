import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import {
    Globe,
    FileText,
    User,
    X,
    Trash2,
    Banknote,
    CheckCircle,
    Percent,
    Users,
    MapPin,
    Clock,
    Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvestorSaved() {
    const [savedStartups, setSavedStartups] = useState([]); // array of saved entries from API
    const [loading, setLoading] = useState(false);
    const [selectedFounder, setSelectedFounder] = useState(null);
    const [pendingRequests, setPendingRequests] = useState({}); // startupId -> 'sending' | true
    const [amountInputs, setAmountInputs] = useState({}); // startupId -> string

    // toasts
    const [toasts, setToasts] = useState([]); // {id, type, title, message}
    const toastTimers = useRef({});

    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");
    const fileUrl = (path) => (!path ? "" : /^https?:\/\//i.test(path) ? path : `${API_BASE}/${String(path).replace(/^\/+/, "")}`);
    const externalUrl = (url) => (!url ? "" : /^https?:\/\//i.test(url) ? url : `https://${url}`);

    useEffect(() => {
        fetchSavedStartups();
        return () => {
            Object.values(toastTimers.current).forEach((t) => clearTimeout(t));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setToasts((t) => [...t, { id, type, title, message }]);
        const timer = setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
            delete toastTimers.current[id];
        }, 4200);
        toastTimers.current[id] = timer;
    };
    const removeToast = (id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
        if (toastTimers.current[id]) {
            clearTimeout(toastTimers.current[id]);
            delete toastTimers.current[id];
        }
    };

    const fetchSavedStartups = async () => {
        setLoading(true);
        try {
            const res = await api.get("investors/saved/");
            setSavedStartups(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch saved startups", err);
            addToast("error", "Load failed", "Could not load saved startups.");
        } finally {
            setLoading(false);
        }
    };

    // unsave by DELETE with body { startup: id } (works with your backend)
    const handleUnsaveStartup = async (id) => {
        // optimistic UI
        const backup = savedStartups.slice();
        setSavedStartups((prev) => prev.filter((s) => (s.startup?.id ?? s.startup) !== id));
        try {
            await api.delete("investors/saved/", { data: { startup: id } });
            addToast("success", "Removed", "Startup removed from saved.");
        } catch (err) {
            console.error("Failed to unsave startup", err);
            setSavedStartups(backup); // rollback
            addToast("error", "Unsave failed", "Could not remove saved startup.");
        }
    };

    // helpers for funding / equity
    const getRaised = (s) => Number(s.amount_raised ?? s.raised_amount ?? 0);
    const fullyFunded = (s) => getRaised(s) >= Number(s.funding_goal || 0);

    const computeEstimatedEquity = (startup, amount) => {
        const fg = Number(startup.funding_goal || 0);
        const equityPct = Number(startup.equity ?? 0);
        const amt = Number(amount);
        if (!fg || fg <= 0 || !equityPct || equityPct <= 0 || Number.isNaN(amt) || amt <= 0) return null;
        return (amt / fg) * equityPct;
    };

    const handleAmountChange = (startupId, value) => {
        const normalized = value === "" ? "" : value.replace(/[^\d.]/g, "");
        setAmountInputs((p) => ({ ...p, [startupId]: normalized }));
    };

    const handleSendRequest = async (startupId) => {
        const entry = savedStartups.find((e) => (e.startup?.id ?? e.startup) === startupId);
        const startup = entry?.startup ?? entry;
        if (!startup) return addToast("error", "Not found", "Startup payload missing.");

        const goal = Number(startup.funding_goal || 0);
        const raised = getRaised(startup);
        const remaining = Math.max(goal - raised, 0);

        const raw = amountInputs[startupId] ?? "";
        const numericAmount = Number(raw);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            return addToast("error", "Invalid amount", "Enter a positive number.");
        }
        if (goal > 0 && numericAmount > remaining) {
            return addToast("error", "Too large", `Amount exceeds remaining ₹${remaining.toLocaleString("en-IN")}`);
        }

        setPendingRequests((p) => ({ ...p, [startupId]: "sending" }));
        try {
            const payload = { startup_id: startupId, amount: numericAmount };
            await api.post("investors/requests/", payload);
            setPendingRequests((p) => ({ ...p, [startupId]: true }));
            addToast("success", "Request sent", `Sent ₹${numericAmount.toLocaleString("en-IN")} to ${startup.name}`);
            // clear input
            setAmountInputs((p) => {
                const copy = { ...p };
                delete copy[startupId];
                return copy;
            });
        } catch (err) {
            console.error("Request failed", err);
            setPendingRequests((p) => {
                const copy = { ...p };
                delete copy[startupId];
                return copy;
            });
            addToast("error", "Send failed", "Could not send request — check console.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold text-white">Saved Startups</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Your bookmarked startups. You can unsave, view founder details or send a funding request from here.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400">Loading saved startups...</p>
                ) : savedStartups.length === 0 ? (
                    <p className="text-center text-gray-400">No saved startups yet 📌</p>
                ) : (
                    <div
                        className="mx-auto"
                        style={{
                            display: "grid",
                            gap: "28px",
                            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                            alignItems: "start",
                        }}
                    >
                        {savedStartups.map((entry) => {
                            const startup = entry.startup ?? entry;
                            if (!startup) return null;
                            const id = startup.id;
                            const raised = getRaised(startup);
                            const goal = Number(startup.funding_goal || 0);
                            const remaining = Math.max(goal - raised, 0);
                            const isRequested = pendingRequests[id] === true;
                            const isSending = pendingRequests[id] === "sending";
                            const isDisabled = fullyFunded(startup) || isRequested || isSending;
                            const inputVal = amountInputs[id] ?? "";
                            const estimatedEquity = computeEstimatedEquity(startup, inputVal);

                            return (
                                <motion.article
                                    key={id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.26 }}
                                    className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] rounded-2xl p-8 shadow-lg border border-white/6 min-h-[260px] flex flex-col justify-between"
                                    style={{ width: "100%" }}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h2 className="text-2xl font-semibold text-white truncate">{startup.name}</h2>
                                                {startup.industry && <p className="text-gray-400 text-sm mt-1">{startup.industry}</p>}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => handleUnsaveStartup(id)}
                                                    variant="ghost"
                                                    size="default"
                                                    className="px-3 py-2 gap-2 rounded-md"
                                                    title="Remove saved"
                                                >
                                                    <Trash2 size={16} />
                                                    <span className="hidden md:inline">Unsave</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-5 mb-4">
                                            {startup.stage && (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-indigo-600/10 text-indigo-300">
                                                    <Clock size={14} /> {startup.stage}
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-teal-600/10 text-teal-200 font-semibold">
                                                <Banknote size={14} /> {goal ? `₹${goal.toLocaleString("en-IN")} goal` : "Goal unset"}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-green-600/10 text-green-200 font-semibold">
                                                <CheckCircle size={14} /> Raised ₹{raised.toLocaleString("en-IN")}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-yellow-600/10 text-yellow-200">
                                                <Clock size={14} /> Remaining ₹{remaining.toLocaleString("en-IN")}
                                            </span>

                                            {startup.equity && (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-pink-600/10 text-pink-200">
                                                    <Percent size={14} /> {startup.equity}% for full goal
                                                </span>
                                            )}
                                        </div>

                                        {startup.description && (
                                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5">{startup.description}</p>
                                        )}

                                        <div className="grid grid-cols-1 gap-3 text-sm text-gray-300 mb-5">
                                            {startup.team_size && (
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Users size={14} className="flex-shrink-0 text-indigo-300" />
                                                    <span className="truncate">
                                                        <span className="text-white/90 font-medium">Team:</span>{" "}
                                                        <span className="ml-1">{startup.team_size}</span>
                                                    </span>
                                                </div>
                                            )}

                                            {startup.location && (
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <MapPin size={14} className="flex-shrink-0 text-teal-300" />
                                                    <span className="truncate">
                                                        <span className="text-white/90 font-medium">Location:</span>{" "}
                                                        <span className="ml-1">{startup.location}</span>
                                                    </span>
                                                </div>
                                            )}

                                            {startup.created_at && (
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Clock size={14} className="flex-shrink-0 text-yellow-300" />
                                                    <span className="truncate">
                                                        <span className="text-white/90 font-medium">Launched:</span>{" "}
                                                        <span className="ml-1">{new Date(startup.created_at).toLocaleDateString()}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3 mb-4 flex-wrap">
                                            {startup.website && (
                                                <a
                                                    href={externalUrl(startup.website)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 text-sm"
                                                >
                                                    <Globe size={14} /> Website
                                                </a>
                                            )}

                                            {startup.pitch_deck && (
                                                <a
                                                    href={fileUrl(startup.pitch_deck)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 text-sm"
                                                >
                                                    <FileText size={14} /> Pitch Deck
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <Button
                                            onClick={() => setSelectedFounder(startup.founder)}
                                            variant="outline"
                                            size="default"
                                            className="w-full flex items-center justify-center gap-2"
                                            disabled={!startup.founder}
                                        >
                                            <User size={16} /> View Founder
                                        </Button>

                                        {!isRequested ? (
                                            <div className="mt-3 flex gap-3 items-center">
                                                <input
                                                    name={`amount-${id}`}
                                                    value={amountInputs[id] ?? ""}
                                                    onChange={(e) => handleAmountChange(id, e.target.value)}
                                                    placeholder={
                                                        fullyFunded(startup)
                                                            ? "Fully funded"
                                                            : remaining > 0
                                                                ? `Amount (max ₹${remaining.toLocaleString("en-IN")})`
                                                                : "Amount"
                                                    }
                                                    className="flex-1 px-4 py-2 rounded-xl bg-[#0F1724] text-white border border-white/6 text-sm"
                                                    disabled={isDisabled}
                                                    min="1"
                                                    max={remaining || undefined}
                                                />
                                                <Button
                                                    onClick={() => handleSendRequest(id)}
                                                    variant="primary"
                                                    size="default"
                                                    className="px-4 flex items-center gap-2"
                                                    disabled={isDisabled || isSending}
                                                >
                                                    <Send size={14} /> Send
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-green-400 font-medium text-center">✅ Request Sent</div>
                                        )}

                                        {(amountInputs[id] ?? "") !== "" && (
                                            <div className="text-xs text-gray-300 mt-1 inline-flex items-center gap-2">
                                                <Percent size={14} />
                                                {estimatedEquity !== null ? (
                                                    <span>
                                                        Estimated equity for ₹{Number(amountInputs[id]).toLocaleString("en-IN")}:{" "}
                                                        <strong className="text-white">{estimatedEquity.toFixed(2)}%</strong>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Equity estimation unavailable</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Founder modal */}
            {selectedFounder && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#1A1F33] text-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-white/6">
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setSelectedFounder(null)}>
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4">👤 Founder Details</h2>

                        <div className="space-y-2 text-sm">
                            {selectedFounder.full_name && <p><strong>Name:</strong> {selectedFounder.full_name}</p>}
                            {selectedFounder.email && <p><strong>Email:</strong> {selectedFounder.email}</p>}
                            {selectedFounder.bio && <p><strong>Bio:</strong> {selectedFounder.bio}</p>}
                            {selectedFounder.skills && <p><strong>Skills:</strong> {selectedFounder.skills}</p>}
                            {selectedFounder.linkedin && (
                                <p>
                                    <strong>LinkedIn:</strong>{" "}
                                    <a href={externalUrl(selectedFounder.linkedin)} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                                        {selectedFounder.linkedin}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TOP-RIGHT TOASTS */}
            <div className="fixed top-6 right-6 z-60 flex flex-col gap-3 items-end px-2">
                <AnimatePresence initial={false}>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.26, ease: "easeOut" }}
                            className={`w-full max-w-xs p-3 rounded-xl shadow-2xl border flex items-start gap-3 pointer-events-auto ${t.type === "success"
                                    ? "bg-gradient-to-r from-green-700/95 to-green-600/85 border-green-500/60 text-white"
                                    : t.type === "error"
                                        ? "bg-gradient-to-r from-red-700/95 to-red-600/85 border-red-500/60 text-white"
                                        : "bg-gradient-to-r from-slate-800/95 to-slate-700/85 border-white/6 text-white"
                                }`}
                        >
                            <div className="pt-0.5">
                                <div className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center">
                                    {t.type === "success" ? <CheckCircle size={18} /> : <X size={16} />}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <strong className="text-sm">{t.title}</strong>
                                    <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white text-xs">Close</button>
                                </div>
                                {t.message && <div className="text-xs mt-1 text-white/90">{t.message}</div>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
