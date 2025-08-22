import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import {
    Globe,
    FileText,
    User,
    X,
    Bookmark,
    Banknote,
    CheckCircle,
    Clock,
    Users,
    MapPin,
    Percent,
    Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BrowseStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState({}); // id -> 'sending' | true
    const [savedSet, setSavedSet] = useState(new Set()); // set of startup ids saved by current user
    const [amountInputs, setAmountInputs] = useState({});
    const [selectedFounder, setSelectedFounder] = useState(null);

    // toasts
    const [toasts, setToasts] = useState([]);
    const toastTimers = useRef({});

    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");
    const fileUrl = (p) => (!p ? "" : /^https?:\/\//i.test(p) ? p : `${API_BASE}/${String(p).replace(/^\/+/, "")}`);
    const externalUrl = (u) => (!u ? "" : /^https?:\/\//i.test(u) ? u : `https://${u}`);

    useEffect(() => {
        fetchStartups();
        fetchSaved();
        return () => {
            // clear toast timers on unmount
            Object.values(toastTimers.current).forEach((t) => clearTimeout(t));
            toastTimers.current = {};
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -----------------------
    // Toast helpers
    // -----------------------
    const addToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
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

    // -----------------------
    // Data fetching
    // -----------------------
    const fetchStartups = async () => {
        setLoading(true);
        try {
            const res = await api.get("investors/browse/");
            setStartups(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch startups", err);
            addToast("error", "Load failed", "Could not load startups (see console)");
        } finally {
            setLoading(false);
        }
    };

    const fetchSaved = async () => {
        try {
            const res = await api.get("investors/saved/");
            const ids =
                Array.isArray(res.data)
                    ? res.data
                        .map((s) => {
                            if (s?.startup?.id) return Number(s.startup.id);
                            if (s?.startup_id) return Number(s.startup_id);
                            if (s?.startup) return Number(s.startup);
                            return null;
                        })
                        .filter(Boolean)
                    : [];
            setSavedSet(new Set(ids));
        } catch (err) {
            console.error("Failed to fetch saved startups", err);
        }
    };

    // -----------------------
    // Save / Unsave
    // -----------------------
    const handleToggleSave = async (startupId) => {
        const isSaved = savedSet.has(startupId);

        if (!isSaved) {
            // optimistic add
            setSavedSet((prev) => {
                const copy = new Set(prev);
                copy.add(startupId);
                return copy;
            });

            try {
                await api.post("investors/saved/", { startup: startupId });
                addToast("success", "Saved", "Startup added to saved list");
            } catch (err) {
                console.error("Failed to save startup", err?.response ?? err);
                // rollback
                setSavedSet((prev) => {
                    const copy = new Set(prev);
                    copy.delete(startupId);
                    return copy;
                });
                addToast("error", "Save failed", err?.response?.data?.error || "Server error");
            }
        } else {
            // optimistic remove
            const backup = new Set(savedSet);
            setSavedSet((prev) => {
                const copy = new Set(prev);
                copy.delete(startupId);
                return copy;
            });

            try {
                await api.delete("investors/saved/", { data: { startup: startupId } });
                addToast("success", "Removed", "Startup removed from saved list");
            } catch (err) {
                console.error("Failed to unsave", err?.response ?? err);
                setSavedSet(backup);
                const server = err?.response?.data || err?.message || "Server error";
                addToast("error", "Unsave failed", typeof server === "string" ? server : JSON.stringify(server));
            }
        }
    };

    // -----------------------
    // Helpers for requests
    // -----------------------
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

    const handleSendRequest = async (startupId, amount, resetForm) => {
        const startup = startups.find((s) => s.id === startupId);
        if (!startup) {
            addToast("error", "Request failed", "Startup not found");
            return;
        }

        const goal = Number(startup.funding_goal || 0);
        const raised = getRaised(startup);
        const remaining = Math.max(goal - raised, 0);

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            addToast("error", "Invalid amount", "Enter a valid positive amount");
            return;
        }
        if (goal > 0 && numericAmount > remaining) {
            addToast("error", "Too large", `Amount exceeds remaining: ₹${remaining.toLocaleString("en-IN")}`);
            return;
        }

        setPendingRequests((prev) => ({ ...prev, [startupId]: "sending" }));
        try {
            const payload = { startup_id: startupId, amount: numericAmount };
            const res = await api.post("investors/requests/", payload);

            setPendingRequests((prev) => ({ ...prev, [startupId]: true }));
            addToast("success", "Request sent", "Founder will review your request");

            setAmountInputs((p) => {
                const copy = { ...p };
                delete copy[startupId];
                return copy;
            });

            if (typeof resetForm === "function") resetForm();
            // refresh to update raised amounts, etc.
            fetchStartups();

            return res.data;
        } catch (err) {
            console.error("Failed to send request", err);
            setPendingRequests((prev) => {
                const copy = { ...prev };
                delete copy[startupId];
                return copy;
            });
            const server = err?.response?.data || err?.message || "Server error";
            addToast("error", "Request failed", typeof server === "string" ? server : JSON.stringify(server));
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                    <div className="max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Browse Startups</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Explore startups seeking funding. Save promising ones, preview estimated equity and send a request.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400">Loading startups…</p>
                ) : startups.length === 0 ? (
                    <p className="text-center text-gray-400">No startups available 🚀</p>
                ) : (
                    /* responsive grid: 1 / 2 / 3 / 4 columns depending on screen */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {startups.map((startup) => {
                            const raised = getRaised(startup);
                            const goal = Number(startup.funding_goal || 0);
                            const remaining = Math.max(goal - raised, 0);
                            const isRequested = pendingRequests[startup.id] === true;
                            const isSending = pendingRequests[startup.id] === "sending";
                            const isDisabled = fullyFunded(startup) || isRequested || isSending;
                            const isSaved = savedSet.has(startup.id);
                            const inputVal = amountInputs[startup.id] ?? "";
                            const estimatedEquity = computeEstimatedEquity(startup, inputVal);

                            return (
                                <motion.article
                                    key={startup.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.26 }}
                                    className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] rounded-2xl p-4 sm:p-6 md:p-7 shadow-lg border border-white/6 min-h-[240px] flex flex-col justify-between overflow-hidden"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h2 className="text-lg sm:text-2xl font-semibold text-white truncate">{startup.name}</h2>
                                                {startup.industry && <p className="text-gray-400 text-sm mt-1 truncate">{startup.industry}</p>}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => handleToggleSave(startup.id)}
                                                    variant={isSaved ? "secondary" : "ghost"}
                                                    size="default"
                                                    className="px-3 py-1 rounded-md flex items-center gap-2"
                                                    title={isSaved ? "Unsave" : "Save"}
                                                >
                                                    <Bookmark size={16} />
                                                    <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-4 mb-3">
                                            {startup.stage && (
                                                <span className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded-full bg-indigo-600/10 text-indigo-300">
                                                    <Clock size={14} /> <span>{startup.stage}</span>
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded-full bg-teal-600/10 text-teal-200 font-semibold">
                                                <Banknote size={14} /> {goal ? `₹${goal.toLocaleString("en-IN")} goal` : "Goal unset"}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded-full bg-green-600/10 text-green-200 font-semibold">
                                                <CheckCircle size={14} /> Raised ₹{raised.toLocaleString("en-IN")}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded-full bg-yellow-600/10 text-yellow-200">
                                                <Clock size={14} /> Remaining ₹{remaining.toLocaleString("en-IN")}
                                            </span>

                                            {startup.equity && (
                                                <span className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded-full bg-pink-600/10 text-pink-200">
                                                    <Percent size={14} /> {startup.equity}% for full goal
                                                </span>
                                            )}
                                        </div>

                                        {startup.description && (
                                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">{startup.description}</p>
                                        )}

                                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-300 mb-4">
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
                                                        <span className="ml-1">{new Date(startup.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>


                                        <div className="flex gap-3 mb-3 flex-wrap">
                                            {startup.website && (
                                                <a
                                                    href={externalUrl(startup.website)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 text-sm truncate"
                                                    title={startup.website}
                                                >
                                                    <Globe size={14} /> Website
                                                </a>
                                            )}

                                            {startup.pitch_deck && (
                                                <a
                                                    href={fileUrl(startup.pitch_deck)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 text-sm truncate"
                                                    title={startup.pitch_deck}
                                                >
                                                    <FileText size={14} /> Pitch Deck
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
                                            <div className="flex-shrink-0">
                                                <Button
                                                    onClick={() => setSelectedFounder(startup.founder)}
                                                    variant="outline"
                                                    size="default"
                                                    className="flex items-center gap-2 w-full sm:w-auto"
                                                >
                                                    <User size={16} /> <span className="hidden sm:inline">View Founder</span>
                                                </Button>
                                            </div>

                                            {!isRequested ? (
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const amountVal = amountInputs[startup.id] ?? e.target.amount.value;
                                                        handleSendRequest(startup.id, amountVal, () => e.target.reset());
                                                    }}
                                                    className="w-full"
                                                >
                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                                                        <input
                                                            name="amount"
                                                            inputMode="numeric"
                                                            value={amountInputs[startup.id] ?? ""}
                                                            onChange={(e) => handleAmountChange(startup.id, e.target.value)}
                                                            placeholder={
                                                                fullyFunded(startup)
                                                                    ? "Fully funded"
                                                                    : remaining > 0
                                                                        ? `Amount (max ₹${remaining.toLocaleString("en-IN")})`
                                                                        : "Amount"
                                                            }
                                                            className="w-full sm:max-w-xs px-4 py-2 rounded-xl bg-[#0F1724] text-white border border-white/6 text-sm"
                                                            required
                                                            disabled={isDisabled}
                                                            min="1"
                                                            max={remaining || undefined}
                                                        />

                                                        <Button
                                                            type="submit"
                                                            variant="primary"
                                                            size="default"
                                                            className="w-full sm:w-auto px-4 flex items-center gap-2 justify-center"
                                                            disabled={isDisabled || isSending}
                                                        >
                                                            <Send size={14} /> {isSending ? "Sending…" : "Send"}
                                                        </Button>
                                                    </div>

                                                    {inputVal !== "" && (
                                                        <div className="text-xs text-gray-300 mt-3 inline-flex items-center gap-2">
                                                            <Percent size={14} />
                                                            {estimatedEquity !== null ? (
                                                                <span>
                                                                    Estimated equity for ₹{Number(inputVal).toLocaleString("en-IN")}:{" "}
                                                                    <strong className="text-white">{estimatedEquity.toFixed(2)}%</strong>
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">Equity estimation unavailable</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </form>
                                            ) : (
                                                <div className="ml-auto text-green-400 font-medium">✅ Request Sent</div>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}

                {/* founder modal */}
                <AnimatePresence>
                    {selectedFounder && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 sm:px-6"
                        >
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                initial={{ scale: 0.99, y: 6 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.99, y: 6 }}
                                className="w-full max-w-lg bg-[#1A1F33] text-white rounded-2xl shadow-xl p-4 sm:p-6 border border-white/6 max-h-[85vh] overflow-y-auto mx-2"
                            >
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xl font-semibold">Founder Details</h3>
                                    <button className="text-gray-400 hover:text-white" onClick={() => setSelectedFounder(null)} aria-label="Close founder modal">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="mt-4 text-sm text-gray-200 space-y-2 break-words">
                                    {selectedFounder.full_name && <div><strong>Name:</strong> {selectedFounder.full_name}</div>}
                                    {selectedFounder.email && <div><strong>Email:</strong> {selectedFounder.email}</div>}
                                    {selectedFounder.bio && <div><strong>Bio:</strong> {selectedFounder.bio}</div>}
                                    {selectedFounder.skills && <div><strong>Skills:</strong> {selectedFounder.skills}</div>}
                                    {selectedFounder.linkedin && (
                                        <div>
                                            <strong>LinkedIn:</strong>{" "}
                                            <a className="text-blue-400 hover:underline break-words" href={externalUrl(selectedFounder.linkedin)} target="_blank" rel="noreferrer">
                                                {selectedFounder.linkedin}
                                            </a>
                                        </div>
                                    )}
                                </div>


                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* toasts (top-right) */}
                <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-3 items-end px-2">
                    <AnimatePresence initial={false}>
                        {toasts.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.22 }}
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
            </div>
        </DashboardLayout>
    );
}
