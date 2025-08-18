import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import { Globe, FileText, User, X } from "lucide-react";
import { motion } from "framer-motion";

export default function BrowseStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFounder, setSelectedFounder] = useState(null);

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

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        setLoading(true);
        try {
            const res = await api.get("investors/browse/");
            setStartups(res.data);
        } catch (err) {
            console.error("Failed to fetch startups", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-white">🚀 Browse Startups</h1>
                </div>

                {/* Loader */}
                {loading && <p className="text-center text-gray-400">Loading startups...</p>}

                {/* Empty state */}
                {!loading && startups.length === 0 && (
                    <p className="text-center text-gray-400">No startups available 🚀</p>
                )}

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((startup) => (
                        <motion.div
                            key={startup.id}
                            className="bg-gradient-to-br from-[#1A1F33] to-[#141826] rounded-2xl p-6 shadow-lg border border-white/10 
                                hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                            whileHover={{ y: -5 }}
                        >
                            {/* Title */}
                            <h2 className="text-xl font-bold text-white mb-1">{startup.name}</h2>
                            {startup.industry && (
                                <p className="text-gray-400 text-sm mb-4">{startup.industry}</p>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {startup.stage && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-indigo-600/20 text-indigo-300">
                                        {startup.stage}
                                    </span>
                                )}
                                {startup.funding_goal && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-teal-600/20 text-teal-300 font-semibold">
                                        💰 ₹{startup.funding_goal}
                                    </span>
                                )}
                                {startup.equity && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-pink-600/20 text-pink-300">
                                        📊 {startup.equity}% Equity
                                    </span>
                                )}
                                {startup.valuation && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-600/20 text-yellow-300">
                                        💎 ₹{startup.valuation}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {startup.description && (
                                <p className="line-clamp-3 text-gray-400 leading-relaxed mb-4">
                                    {startup.description}
                                </p>
                            )}

                            {/* Extra Info */}
                            <div className="space-y-1 text-sm text-gray-300 mb-4">
                                {startup.team_size && <p>👥 Team Size: {startup.team_size}</p>}
                                {startup.location && <p>📍 {startup.location}</p>}
                                {startup.created_at && (
                                    <p>⏳ {new Date(startup.created_at).toLocaleDateString()}</p>
                                )}
                            </div>

                            {/* Links */}
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

                            {/* Founder Modal Trigger */}
                            {startup.founder && (
                                <div className="space-y-2">
                                    <button
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                                        onClick={() => setSelectedFounder(startup.founder)}
                                    >
                                        <User size={16} /> View Founder
                                    </button>

                                    {/* Investment Request Form */}
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const amount = e.target.amount.value;
                                            try {
                                                await api.post("investors/requests/", {
                                                    startup: startup.id,
                                                    amount: amount,
                                                });
                                                alert("✅ Request sent successfully");
                                                e.target.reset();
                                            } catch (err) {
                                                console.error(err);
                                                alert("❌ Failed to send request");
                                            }
                                        }}
                                        className="flex gap-2"
                                    >
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Amount"
                                            className="flex-1 px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-sm"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            )}

                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Custom Founder Modal */}
            {selectedFounder && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#1A1F33] text-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            onClick={() => setSelectedFounder(null)}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4">👤 Founder Details</h2>

                        <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedFounder.full_name}</p>
                            <p><strong>Email:</strong> {selectedFounder.email}</p>
                            {selectedFounder.bio && <p><strong>Bio:</strong> {selectedFounder.bio}</p>}
                            {selectedFounder.skills && <p><strong>Skills:</strong> {selectedFounder.skills}</p>}
                            {selectedFounder.linkedin && (
                                <p>
                                    <strong>LinkedIn:</strong>{" "}
                                    <a
                                        href={selectedFounder.linkedin}
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