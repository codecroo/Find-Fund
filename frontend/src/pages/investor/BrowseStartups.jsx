import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import { Globe, FileText, User, X, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function BrowseStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFounder, setSelectedFounder] = useState(null);
    const [pendingRequests, setPendingRequests] = useState({});
    const [savedStartups, setSavedStartups] = useState(new Set()); // track saved

    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");

    const fileUrl = (path) => (!path ? "" : /^https?:\/\//i.test(path) ? path : `${API_BASE}/${String(path).replace(/^\/+/, "")}`);
    const externalUrl = (url) => (!url ? "" : /^https?:\/\//i.test(url) ? url : `https://${url}`);

    useEffect(() => {
        fetchStartups();
        fetchSaved();
    }, []);

    const fetchStartups = async () => {
        setLoading(true);
        try {
            const res = await api.get("investors/browse/");
            setStartups(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch startups", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSaved = async () => {
        try {
            const res = await api.get("investors/saved/");
            const ids = res.data.map((s) => s.startup.id);
            setSavedStartups(new Set(ids));
        } catch (err) {
            console.error("Failed to fetch saved startups", err);
        }
    };

    const handleSaveStartup = async (startupId) => {
        try {
            // ✅ backend expects { startup: id }
            await api.post("investors/saved/", { startup: startupId });
            setSavedStartups((prev) => new Set([...prev, startupId]));
            alert("✅ Startup saved!");
        } catch (err) {
            console.error("Failed to save startup", err);
            alert("❌ Could not save startup");
        }
    };

    // ---- request handling ----
    const getRaised = (s) => Number(s.amount_raised ?? s.raised_amount ?? 0);
    const fullyFunded = (s) => getRaised(s) >= Number(s.funding_goal || 0);

    const handleSendRequest = async (startupId, amount, resetForm) => {
        const startup = startups.find((s) => s.id === startupId);
        if (!startup) return alert("Startup not found");

        const goal = Number(startup.funding_goal || 0);
        const raised = getRaised(startup);
        const remaining = Math.max(goal - raised, 0);

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            return alert("Please enter a valid positive amount");
        }
        if (numericAmount > remaining) {
            return alert(`Amount exceeds remaining requirement. Remaining: ₹${remaining}`);
        }

        setPendingRequests((prev) => ({ ...prev, [startupId]: "sending" }));

        try {
            // ✅ backend expects { startup: id, amount }
            const payload = { startup: startupId, amount: numericAmount };
            const res = await api.post("investors/requests/", payload);

            setPendingRequests((prev) => ({ ...prev, [startupId]: true }));
            alert("✅ Request sent successfully");

            if (typeof resetForm === "function") resetForm();
            return res.data;
        } catch (err) {
            console.error("❌ Failed to send request", err);
            setPendingRequests((prev) => {
                const copy = { ...prev };
                delete copy[startupId];
                return copy;
            });
            alert("Failed to send request");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-white">🚀 Browse Startups</h1>
                </div>

                {loading && <p className="text-center text-gray-400">Loading startups...</p>}
                {!loading && startups.length === 0 && <p className="text-center text-gray-400">No startups available 🚀</p>}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((startup) => {
                        const raised = getRaised(startup);
                        const goal = Number(startup.funding_goal || 0);
                        const remaining = Math.max(goal - raised, 0);
                        const isRequested = pendingRequests[startup.id] === true;
                        const isSending = pendingRequests[startup.id] === "sending";
                        const isDisabled = fullyFunded(startup) || isRequested || isSending;
                        const isSaved = savedStartups.has(startup.id);

                        return (
                            <motion.div
                                key={startup.id}
                                className="bg-gradient-to-br from-[#1A1F33] to-[#141826] rounded-2xl p-6 shadow-lg border border-white/10 
                                    hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                                whileHover={{ y: -5 }}
                            >
                                <h2 className="text-xl font-bold text-white mb-1">{startup.name}</h2>
                                {startup.industry && <p className="text-gray-400 text-sm mb-4">{startup.industry}</p>}

                                {/* SAVE BUTTON */}
                                <button
                                    onClick={() => handleSaveStartup(startup.id)}
                                    disabled={isSaved}
                                    className={`mb-3 flex items-center gap-2 px-3 py-1 rounded-lg text-sm 
                                        ${isSaved ? "bg-green-600/20 text-green-400 cursor-not-allowed" : "bg-white/10 text-white hover:bg-white/20"}`}
                                >
                                    <Bookmark size={14} />
                                    {isSaved ? "Saved" : "Save"}
                                </button>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {startup.stage && (
                                        <span className="px-3 py-1 text-sm rounded-full bg-indigo-600/20 text-indigo-300">
                                            {startup.stage}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 text-sm rounded-full bg-teal-600/20 text-teal-300 font-semibold">
                                        💰 Goal: ₹{goal}
                                    </span>
                                    <span className="px-3 py-1 text-sm rounded-full bg-green-600/20 text-green-300 font-semibold">
                                        ✅ Raised: ₹{raised}
                                    </span>
                                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-600/20 text-yellow-300">
                                        ⏳ Remaining: ₹{remaining}
                                    </span>
                                    {startup.equity && (
                                        <span className="px-3 py-1 text-sm rounded-full bg-pink-600/20 text-pink-300">
                                            📊 {startup.equity}% Equity
                                        </span>
                                    )}
                                </div>

                                {startup.description && (
                                    <p className="line-clamp-3 text-gray-400 leading-relaxed mb-4">{startup.description}</p>
                                )}

                                <div className="space-y-1 text-sm text-gray-300 mb-4">
                                    {startup.team_size && <p>👥 Team Size: {startup.team_size}</p>}
                                    {startup.location && <p>📍 {startup.location}</p>}
                                    {startup.created_at && <p>⏳ {new Date(startup.created_at).toLocaleDateString()}</p>}
                                </div>

                                <div className="flex gap-3 mb-4">
                                    {startup.website && (
                                        <a
                                            href={externalUrl(startup.website)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                                        >
                                            <Globe size={14} /> Website
                                        </a>
                                    )}
                                    {startup.pitch_deck && (
                                        <a
                                            href={fileUrl(startup.pitch_deck)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30"
                                        >
                                            <FileText size={14} /> Pitch Deck
                                        </a>
                                    )}
                                </div>

                                {startup.founder && (
                                    <div className="space-y-2">
                                        <button
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                                            onClick={() => setSelectedFounder(startup.founder)}
                                        >
                                            <User size={16} /> View Founder
                                        </button>

                                        {!isRequested ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const amount = e.target.amount.value;
                                                    handleSendRequest(startup.id, amount, () => e.target.reset());
                                                }}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    placeholder={
                                                        fullyFunded(startup)
                                                            ? "Fully funded"
                                                            : remaining > 0
                                                                ? `Amount (max ₹${remaining})`
                                                                : "Amount"
                                                    }
                                                    className="flex-1 px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-sm"
                                                    required
                                                    disabled={isDisabled}
                                                    min="1"
                                                    max={remaining}
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                                                    disabled={isDisabled}
                                                >
                                                    {isSending ? "Sending..." : "Send"}
                                                </button>
                                            </form>
                                        ) : (
                                            <p className="text-green-400 text-center font-medium">✅ Request Sent</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {selectedFounder && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#1A1F33] text-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            onClick={() => setSelectedFounder(null)}
                        >
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
                                    <a
                                        href={externalUrl(selectedFounder.linkedin)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        {selectedFounder.linkedin}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
