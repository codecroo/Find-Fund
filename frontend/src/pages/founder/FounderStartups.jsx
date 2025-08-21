import React, { useEffect, useState, useRef } from "react";
import {
    PlusCircle,
    X,
    Pencil,
    Trash2,
    Globe,
    FileText,
    RefreshCw,
    Banknote,
    CheckCircle,
    Users,
    MapPin,
    Rocket,
    Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button"; // using your Button component

// FounderStartups — uses user's Button component for all actions
export default function FounderStartups() {
    const [startups, setStartups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStartup, setEditingStartup] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [newStartup, setNewStartup] = useState(getEmptyStartup());
    const [query, setQuery] = useState("");
    const pollRef = useRef(null);

    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");

    function fileUrl(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `${API_BASE}/${String(path).replace(/^\/+/, "")}`;
    }

    function externalUrl(url) {
        if (!url) return "";
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }

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

    useEffect(() => {
        fetchStartups();
        pollRef.current = setInterval(() => fetchStartups().catch(() => { }), 10000);
        return () => clearInterval(pollRef.current);
    }, []);

    const fetchStartups = async () => {
        setFetching(true);
        try {
            const res = await api.get("startups/");
            setStartups(Array.isArray(res.data) ? res.data : []);
            return res.data;
        } catch (err) {
            console.error("Failed to fetch startups", err);
            return [];
        } finally {
            setFetching(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newStartup.name.trim()) newErrors.name = "Startup Name is required";
        if (!newStartup.stage) newErrors.stage = "Please select a stage";
        if (!newStartup.funding_goal || Number(newStartup.funding_goal) <= 0) {
            newErrors.funding_goal = "Funding Goal is required and must be positive";
        }
        if (!newStartup.equity || Number(newStartup.equity) <= 0) {
            newErrors.equity = "Equity Offered is required and must be greater than 0";
        }
        if (!editingStartup && !(newStartup.pitch_deck instanceof File)) {
            newErrors.pitch_deck = "Pitch Deck file is required";
        }
        if (newStartup.team_size && Number(newStartup.team_size) <= 0) {
            newErrors.team_size = "Team Size must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", newStartup.name);
            formData.append("stage", newStartup.stage);
            formData.append("funding_goal", newStartup.funding_goal);
            ["industry", "description", "team_size", "location", "equity"].forEach((f) => {
                if (newStartup[f] !== undefined && newStartup[f] !== null) formData.append(f, newStartup[f]);
            });
            formData.append("website", newStartup.website || "");
            if (newStartup.pitch_deck instanceof File) formData.append("pitch_deck", newStartup.pitch_deck);

            let res;
            if (editingStartup) {
                res = await api.put(`startups/${editingStartup.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setStartups((prev) => prev.map((s) => (s.id === editingStartup.id ? res.data : s)));
            } else {
                res = await api.post("startups/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setStartups((prev) => [res.data, ...prev]);
            }
            await fetchStartups();
            handleClose(false);
        } catch (err) {
            console.error("Failed to save startup", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

  
    const handleEdit = (startup) => {
        setEditingStartup(startup);
        setNewStartup({
            name: startup.name || "",
            industry: startup.industry || "",
            stage: startup.stage || "",
            funding_goal: startup.funding_goal ?? "",
            equity: startup.equity ?? "",
            description: startup.description || "",
            website: startup.website || "",
            team_size: startup.team_size ?? "",
            location: startup.location || "",
            pitch_deck: null,
        });
        setShowForm(true);
    };

    const handleClose = (refetch = true) => {
        setShowForm(false);
        setEditingStartup(null);
        setNewStartup(getEmptyStartup());
        setErrors({});
        if (refetch) fetchStartups().catch(() => { });
    };

    const calcValuation = () => {
        if (newStartup.funding_goal && newStartup.equity > 0) {
            return Number(newStartup.funding_goal) / (Number(newStartup.equity) / 100);
        }
        return null;
    };

    const getRaised = (s) => Number(s.amount_raised ?? s.raised_amount ?? 0);
    const fullyFunded = (s) => getRaised(s) >= Number(s.funding_goal || 0);


    const filtered = startups.filter((s) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            String(s.name || "").toLowerCase().includes(q) ||
            String(s.industry || "").toLowerCase().includes(q) ||
            String(s.stage || "").toLowerCase().includes(q)
        );
    });

    const cardVariant = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };
    const modalVariant = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white">My Startups</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">Manage your portfolio, pitch decks and fundraising progress — a clean place to track progress and invite investors.</p>
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
                            onClick={() => setShowForm(true)}
                            variant="primary"
                            size="lg"
                            className="fixed bottom-8 right-8 rounded-full px-6 py-3 gap-2 z-100 shadow-xl"
                        >
                            <PlusCircle size={20} />
                            <span>Add Startup</span>
                        </Button>

                    </div>
                </div>

                {/* Grid: fewer columns -> bigger, more spacious cards */}
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center mt-20 text-center text-gray-400"
                        >
                            <h3 className="text-lg">No startups added yet</h3>
                            <p className="mt-2 text-sm">Click <button onClick={() => setShowForm(true)} className="text-indigo-400 hover:underline">Add Startup</button> to create your first one.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                            {filtered.map((startup, idx) => {
                                const raised = getRaised(startup);
                                const goal = Number(startup.funding_goal || 0);
                                const progress = Math.min(goal === 0 ? 0 : (raised / goal) * 100, 100);

                                return (
                                    <motion.article
                                        key={startup.id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={cardVariant}
                                        transition={{ duration: 0.28, delay: idx * 0.03 }}
                                        whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.4)" }}
                                        className="bg-gradient-to-b from-[#0F1622] to-[#0B1220] border border-white/6 rounded-2xl p-6 min-h-[220px] shadow-md hover:shadow-2xl transition-transform duration-300"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0">
                                                <h3 className="text-lg md:text-xl font-semibold text-white truncate max-w-[420px]">{startup.name}</h3>
                                                {startup.industry && <p className="text-sm text-gray-400 mt-1">{startup.industry}</p>}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button onClick={() => handleEdit(startup)} variant="ghost" size="icon" className="p-2 rounded-md bg-indigo-600/12 hover:bg-indigo-600/20 text-indigo-300" title="Edit">
                                                    <Pencil size={15} />
                                                </Button>


                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-4">
                                            {startup.stage && (
                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 text-indigo-300 text-sm">
                                                    <Rocket size={14} /> <span className="truncate">{startup.stage}</span>
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 text-sm text-teal-200">
                                                <Banknote size={14} /> Goal: ₹{Number(startup.funding_goal || 0).toLocaleString()}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 text-sm text-green-200">
                                                <CheckCircle size={14} /> Raised: ₹{raised.toLocaleString()}
                                            </span>
                                        </div>

                                        {startup.description && <p className="mt-4 text-sm text-gray-300">{startup.description}</p>}

                                        <div className="mt-5">
                                            <div className="w-full h-3 rounded-full bg-white/6 overflow-hidden">
                                                <div
                                                    className={`h-3 rounded-full ${fullyFunded(startup) ? "bg-green-400" : "bg-indigo-500"}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-4">
                                                    {startup.team_size && (
                                                        <span className="inline-flex items-center gap-2">
                                                            <Users size={15} /> {startup.team_size}
                                                        </span>
                                                    )}
                                                    {startup.location && (
                                                        <span className="inline-flex items-center gap-2">
                                                            <MapPin size={15} /> {startup.location}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {startup.website && (
                                                        <a href={externalUrl(startup.website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-300 hover:underline">
                                                            <Globe size={15} /> Website
                                                        </a>
                                                    )}
                                                    {startup.pitch_deck && (
                                                        <a href={fileUrl(startup.pitch_deck)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-purple-300 hover:underline">
                                                            <FileText size={15} /> Pitch
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm px-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="w-full max-w-2xl bg-[#0B1220] rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
                                variants={modalVariant}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <div className="flex items-start justify-between">
                                    <h2 className="text-xl font-semibold text-white">{editingStartup ? "Edit Startup" : "Add Startup"}</h2>
                                    <button onClick={() => handleClose()} className="text-gray-400 hover:text-white p-2 rounded-full">
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-300 flex items-center gap-2">Name</label>
                                            <input
                                                type="text"
                                                placeholder="Startup Name"
                                                value={newStartup.name}
                                                onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-300">Stage</label>
                                            <select
                                                value={newStartup.stage}
                                                onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                            >
                                                <option value="">Select Stage</option>
                                                <option value="Idea">Idea</option>
                                                <option value="Prototype">Prototype</option>
                                                <option value="MVP">MVP</option>
                                                <option value="Seed">Seed</option>
                                                <option value="Series A">Series A</option>
                                                <option value="Series B">Series B</option>
                                            </select>
                                            {errors.stage && <p className="text-red-500 text-xs mt-1">{errors.stage}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-300">Funding Goal (INR)</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={newStartup.funding_goal}
                                                onChange={(e) => setNewStartup({ ...newStartup, funding_goal: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                            />
                                            {errors.funding_goal && <p className="text-red-500 text-xs mt-1">{errors.funding_goal}</p>}
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-300">Equity (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="e.g. 10"
                                                value={newStartup.equity}
                                                onChange={(e) => setNewStartup({ ...newStartup, equity: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                            />
                                            {errors.equity && <p className="text-red-500 text-xs mt-1">{errors.equity}</p>}
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-300">Team Size</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 5"
                                                value={newStartup.team_size}
                                                onChange={(e) => setNewStartup({ ...newStartup, team_size: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[#0F1724] text-white"
                                            />
                                            {errors.team_size && <p className="text-red-500 text-xs mt-1">{errors.team_size}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-300">Short Description</label>
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

                                    {editingStartup?.pitch_deck && !newStartup.pitch_deck && (
                                        <p className="text-sm text-gray-400">Current file: <a href={fileUrl(editingStartup.pitch_deck)} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">View Pitch Deck</a></p>
                                    )}

                                    <div>
                                        <label className="text-xs text-gray-300">Pitch Deck (PDF/PPT)</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.ppt,.pptx"
                                            onChange={(e) => setNewStartup({ ...newStartup, pitch_deck: e.target.files[0] })}
                                            className="w-full p-2 rounded-xl bg-[#0F1724] text-white"
                                        />
                                        {errors.pitch_deck && <p className="text-red-500 text-xs mt-1">{errors.pitch_deck}</p>}
                                    </div>

                                    {calcValuation() && <p className="text-green-400 text-sm">Estimated Valuation: ₹{calcValuation().toLocaleString()}</p>}

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <Button type="button" variant="secondary" onClick={() => handleClose()} size="default">
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading} variant="primary" size="lg">
                                            {loading ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
