import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import { Globe, FileText } from "lucide-react";

export default function BrowseStartups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(false);

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
                    <h1 className="text-3xl font-bold text-white">Browse Startups</h1>
                </div>

                {/* Loader */}
                {loading && (
                    <p className="text-center text-gray-400">Loading startups...</p>
                )}

                {/* Empty state */}
                {!loading && startups.length === 0 && (
                    <p className="text-center text-gray-400">No startups available 🚀</p>
                )}

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((startup) => (
                        <div
                            key={startup.id}
                            className="bg-gradient-to-br from-[#1A1F33] to-[#141826] rounded-2xl p-6 shadow-lg border border-white/10 
              hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                        >
                            {/* Title */}
                            <h2 className="text-xl font-bold text-white mb-2">{startup.name}</h2>
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
                            </div>

                            {/* Description */}
                            {startup.description && (
                                <p className="line-clamp-3 text-gray-400 leading-relaxed mb-4">
                                    {startup.description}
                                </p>
                            )}

                            {/* Extra Info */}
                            <div className="space-y-1 text-sm text-gray-300 mb-4">
                                {startup.team_size && <p>👥 Team: {startup.team_size}</p>}
                                {startup.location && <p>📍 {startup.location}</p>}
                            </div>

                            {/* Links */}
                            <div className="flex gap-3">
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
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}