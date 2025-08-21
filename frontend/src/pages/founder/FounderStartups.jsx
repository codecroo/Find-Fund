import React, { useEffect, useRef, useState } from "react";
import {
    PlusCircle,
    Pencil,
    Globe,
    FileText,
    Banknote,
    CheckCircle,
    Users,
    MapPin,
    Rocket,
    Search,
    Percent,
    Info,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button";

export default function FounderStartups() {
    const [startups, setStartups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStartup, setEditingStartup] = useState(null);
    const [newStartup, setNewStartup] = useState(getEmptyStartup());
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    // toasts (simple)
    const [toasts, setToasts] = useState([]);
    const toastTimers = useRef({});

    useEffect(() => {
        fetchStartups();
        const id = setInterval(() => fetchStartups().catch(() => { }), 20000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getEmptyStartup() {
        return {
            name: "",
            industry: "",
            stage: "",
            funding_goal: "",
            equity: "",
            description: "",
            website: "",
            team_size: "",
            location: "",
            pitch_deck: null,
        };
    }

    function fileUrl(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");
        return `${API_BASE}/${String(path).replace(/^\/+/, "")}`;
    }

    function externalUrl(url) {
        if (!url) return "";
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }

    const pushToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts((t) => [...t, { id, type, title, message }]);
        toastTimers.current[id] = setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
            delete toastTimers.current[id];
        }, 3500);
    };
    const removeToast = (id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
        if (toastTimers.current[id]) {
            clearTimeout(toastTimers.current[id]);
            delete toastTimers.current[id];
        }
    };

    const fetchStartups = async () => {
        try {
            setLoading(true);
            const res = await api.get("startups/");
            setStartups(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch startups", err);
            pushToast("error", "Load failed", "Could not load startups (see console).");
        } finally {
            setLoading(false);
        }
    };

    // Create or update startup
    const handleSubmit = async (e) => {
        e.preventDefault();

        // client-side validation
        const g = Number(newStartup.funding_goal || 0);
        const eq = Number(newStartup.equity || 0);
        if (!newStartup.name?.trim()) return pushToast("error", "Validation", "Startup name is required.");
        if (!newStartup.stage) return pushToast("error", "Validation", "Stage is required.");
        if (!g || g <= 0) return pushToast("error", "Validation", "Funding goal must be a positive number.");
        if (!eq || eq <= 0) return pushToast("error", "Validation", "Equity must be greater than 0.");
        if (!editingStartup && !(newStartup.pitch_deck instanceof File))
            return pushToast("error", "Validation", "Pitch deck file is required for new startups.");

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", newStartup.name);
            formData.append("stage", newStartup.stage);
            formData.append("funding_goal", newStartup.funding_goal);
            formData.append("equity", newStartup.equity);
            formData.append("industry", newStartup.industry || "");
            formData.append("description", newStartup.description || "");
            formData.append("website", newStartup.website || "");
            formData.append("team_size", newStartup.team_size || "");
            formData.append("location", newStartup.location || "");
            if (newStartup.pitch_deck instanceof File) formData.append("pitch_deck", newStartup.pitch_deck);

            if (editingStartup) {
                const res = await api.put(`startups/${editingStartup.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                pushToast("success", "Saved", "Startup updated.");
                setStartups((prev) => prev.map((s) => (s.id === editingStartup.id ? res.data : s)));
            } else {
                const res = await api.post("startups/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                pushToast("success", "Created", "Startup created.");
                setStartups((prev) => [res.data, ...prev]);
            }

            handleClose(true);
        } catch (err) {
            console.error("Save failed", err);
            const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
            pushToast("error", "Save failed", typeof serverMsg === "string" ? serverMsg : "See console");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (s) => {
        setEditingStartup(s);
        setNewStartup({
            name: s.name || "",
            industry: s.industry || "",
            stage: s.stage || "",
            funding_goal: s.funding_goal ?? "",
            equity: s.equity ?? "",
            description: s.description || "",
            website: s.website || "",
            team_size: s.team_size ?? "",
            location: s.location || "",
            pitch_deck: null,
        });
        setShowForm(true);
    };

    const handleClose = (refetch = false) => {
        setShowForm(false);
        setEditingStartup(null);
        setNewStartup(getEmptyStartup());
        if (refetch) fetchStartups().catch(() => { });
    };

    const computeValuation = (s) => {
        const fg = Number(s.funding_goal || 0);
        const eq = Number(s.equity || 0);
        if (!fg || !eq) return null;
        return fg / (eq / 100);
    };

    const getRaised = (s) => Number(s.amount_raised ?? s.raised_amount ?? 0);
    const fullyFunded = (s) => getRaised(s) >= Number(s.funding_goal || 0);

    const shortINR = (n) => {
        if (n === null || n === undefined || n === "") return "—";
        const num = Number(n);
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
        return `₹${num.toLocaleString("en-IN")}`;
    };

    const filtered = startups.filter((s) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            String(s.name || "").toLowerCase().includes(q) ||
            String(s.industry || "").toLowerCase().includes(q) ||
            String(s.stage || "").toLowerCase().includes(q)
        );
    });

    // form validity (used to disable submit)
    const isFormValid =
        Boolean(newStartup.name?.trim()) &&
        Boolean(newStartup.stage) &&
        Number(newStartup.funding_goal) > 0 &&
        Number(newStartup.team_size) > 0 &&
        Number(newStartup.equity) > 0 &&
        (editingStartup ? true : newStartup.pitch_deck instanceof File);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white">My Startups</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">Manage your portfolio, pitch decks and fundraising progress.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search startups, industry or stage"
                                className="pl-12 pr-4 py-3 rounded-full bg-[#0F1724] border border-white/6 text-sm text-gray-200 w-[280px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        <Button
                            onClick={() => {
                                setShowForm(true);
                                setEditingStartup(null);
                                setNewStartup(getEmptyStartup());
                            }}
                            variant="primary"
                            size="lg"
                            className="rounded-full px-4 py-2 gap-2"
                        >
                            <PlusCircle size={18} /> Add Startup
                        </Button>
                    </div>
                </div>

                {/* grid two columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-400 py-10">Loading…</div>
                    ) : filtered.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400 py-16">
                            <div className="text-lg">No startups yet</div>
                            <div className="mt-2 text-sm">
                                Click{" "}
                                <button onClick={() => setShowForm(true)} className="text-indigo-400 hover:underline">
                                    Add Startup
                                </button>{" "}
                                to create one.
                            </div>
                        </div>
                    ) : (
                        filtered.map((startup) => {
                            const raised = getRaised(startup);
                            const goal = Number(startup.funding_goal || 0);
                            const remaining = Math.max(goal - raised, 0);
                            const progress = Math.min(goal === 0 ? 0 : (raised / goal) * 100, 100);
                            const valuation = computeValuation(startup);

                            return (
                                <article key={startup.id} className="bg-gradient-to-b from-[#0F1622] to-[#0B1220] border border-white/6 rounded-2xl p-6 min-h-[220px] shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <h3 className="text-lg md:text-xl font-semibold text-white truncate">{startup.name}</h3>
                                            {startup.industry && <p className="text-sm text-gray-400 mt-1">{startup.industry}</p>}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => handleEdit(startup)} variant="ghost" size="icon" className="p-2 rounded-md bg-indigo-600/12 text-indigo-300" title="Edit">
                                                <Pencil size={15} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* equity + valuation + progress label */}
                                    <div className="flex items-center gap-3 mt-4">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-600/12 text-pink-300 text-sm">
                                            <Percent size={14} /> <span className="font-medium">{startup.equity ? `${Number(startup.equity).toFixed(2)}%` : "—"}</span>
                                            <span className="text-xs text-gray-400 ml-2">equity</span>
                                        </span>

                                        {valuation !== null && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 text-sm text-teal-200">
                                                <Info size={14} /> <span className="font-medium">{shortINR(Math.round(valuation))}</span>
                                                <span className="text-xs text-gray-400 ml-2">valuation</span>
                                            </span>
                                        )}

                                        <div className="ml-auto text-xs text-gray-400">Progress: <strong className="text-white ml-1">{progress.toFixed(0)}%</strong></div>
                                    </div>

                                    {/* badges */}
                                    <div className="flex flex-wrap gap-3 mt-4 mb-3">
                                        {startup.stage && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-indigo-600/10 text-indigo-300">
                                                <Rocket size={14} /> {startup.stage}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-white/6 text-teal-200">
                                            <Banknote size={14} /> Goal: {shortINR(goal)}
                                        </span>

                                        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-green-600/10 text-green-200">
                                            <CheckCircle size={14} /> Raised: {shortINR(raised)}
                                        </span>

                                        <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-yellow-600/10 text-yellow-200">
                                            <Info size={14} /> Remaining: {shortINR(remaining)}
                                        </span>

                                        {startup.team_size && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-white/6 text-gray-200">
                                                <Users size={14} /> {startup.team_size} Members
                                            </span>
                                        )}

                                        {startup.location && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-white/6 text-gray-200">
                                                <MapPin size={14} /> {startup.location}
                                            </span>
                                        )}
                                    </div>

                                    {startup.description && <p className="mt-1 text-sm text-gray-300 line-clamp-3">{startup.description}</p>}

                                    {/* progress bar - SIMPLE single color */}
                                    <div className="mt-4">
                                        <div className="w-full bg-white/6 rounded-full h-3 overflow-hidden">
                                            <div className="h-3 rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                                            <div>Funded: <span className="text-white font-medium ml-1">{progress.toFixed(0)}%</span></div>
                                        </div>
                                    </div>

                                    {/* links */}
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4 text-gray-300">
                                            {startup.website && (
                                                <a href={externalUrl(startup.website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-300 hover:underline">
                                                    <Globe size={14} /> Website
                                                </a>
                                            )}
                                            {startup.pitch_deck && (
                                                <a href={fileUrl(startup.pitch_deck)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-purple-300 hover:underline">
                                                    <FileText size={14} /> Pitch
                                                </a>
                                            )}
                                        </div>

                                        <div />
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>

                {/* modal form (complete) */}
                {showForm && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
                        <div className="w-full max-w-2xl bg-[#0B1220] rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-white/6">
                            <div className="flex items-start justify-between">
                                <h2 className="text-xl font-semibold text-white">{editingStartup ? "Edit Startup" : "Add Startup"}</h2>
                                <button onClick={() => handleClose(false)} className="text-gray-400 hover:text-white p-2 rounded-full">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-300 flex items-center gap-1">
                                            Name <span className="text-red-400 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Startup name"
                                            value={newStartup.name}
                                            onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-300 flex items-center gap-1">
                                            Stage <span className="text-red-400 ml-1">*</span>
                                        </label>
                                        <select
                                            value={newStartup.stage}
                                            onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        >
                                            <option value="">Select stage</option>
                                            <option value="Idea">Idea</option>
                                            <option value="Prototype">Prototype</option>
                                            <option value="MVP">MVP</option>
                                            <option value="Seed">Seed</option>
                                            <option value="Series A">Series A</option>
                                            <option value="Series B">Series B</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-300 flex items-center gap-1">
                                            Funding goal (INR) <span className="text-red-400 ml-1">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newStartup.funding_goal}
                                            onChange={(e) => setNewStartup({ ...newStartup, funding_goal: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-300 flex items-center gap-1">
                                            Equity (%) <span className="text-red-400 ml-1">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g. 10"
                                            value={newStartup.equity}
                                            onChange={(e) => setNewStartup({ ...newStartup, equity: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-300">Team size</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={newStartup.team_size}
                                            onChange={(e) => setNewStartup({ ...newStartup, team_size: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-300">Short description</label>
                                    <textarea
                                        rows={3}
                                        value={newStartup.description}
                                        onChange={(e) => setNewStartup({ ...newStartup, description: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-300">Website</label>
                                        <input
                                            type="url"
                                            placeholder="https://yourproduct.com"
                                            value={newStartup.website}
                                            onChange={(e) => setNewStartup({ ...newStartup, website: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-300">Location</label>
                                        <input
                                            type="text"
                                            placeholder="City, Country"
                                            value={newStartup.location}
                                            onChange={(e) => setNewStartup({ ...newStartup, location: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-300 flex items-center gap-1">
                                        Pitch Deck (PDF/PPT) {editingStartup ? <span className="text-xs text-gray-400 ml-2">(optional on edit)</span> : <span className="text-red-400 ml-1">*</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.ppt,.pptx"
                                        onChange={(e) => setNewStartup({ ...newStartup, pitch_deck: e.target.files[0] })}
                                        className="w-full p-2 rounded-xl bg-[#0F1724] text-white"
                                    />
                                </div>

                                {/* inline validation hints */}
                                <div className="text-xs text-gray-300 space-y-1">
                                    {!newStartup.name?.trim() && <div className="text-red-400">Startup name is required.</div>}
                                    {!newStartup.stage && <div className="text-red-400">Stage is required.</div>}
                                    {!(Number(newStartup.funding_goal) > 0) && <div className="text-red-400">Funding goal must be a positive number.</div>}
                                    {!(Number(newStartup.equity) > 0) && <div className="text-red-400">Equity must be greater than 0.</div>}
                                    {!editingStartup && !(newStartup.pitch_deck instanceof File) && <div className="text-red-400">Pitch deck required for new startup.</div>}
                                </div>

                                {newStartup.funding_goal && newStartup.equity && (
                                    <div className="text-sm text-green-400">
                                        Estimated valuation:{" "}
                                        <strong className="text-white">
                                            {shortINR(Math.round(Number(newStartup.funding_goal) / (Number(newStartup.equity) / 100)))}
                                        </strong>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <Button type="button" variant="secondary" onClick={() => handleClose(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={!isFormValid || loading}>
                                        {editingStartup ? (loading ? "Saving..." : "Save changes") : loading ? "Saving..." : "Create Startup"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* toasts (top-right) */}
                <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end px-2 pointer-events-none">
                    <AnimatePresence initial={false}>
                        {toasts.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                                className={`pointer-events-auto w-full max-w-xs p-3 rounded-xl shadow-2xl border flex items-start gap-3
              ${t.type === "success"
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
                                        <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white text-xs ml-2" aria-label="Close toast">
                                            Close
                                        </button>
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
