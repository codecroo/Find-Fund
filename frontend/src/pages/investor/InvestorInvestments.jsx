import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import { FileText, Globe } from "lucide-react";

export default function InvestorInvestments() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");
    const fileUrl = (p) => (!p ? "" : /^https?:\/\//i.test(p) ? p : `${API_BASE}/${String(p).replace(/^\/+/, "")}`);
    const externalUrl = (u) => (!u ? "" : /^https?:\/\//i.test(u) ? u : `https://${u}`);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const res = await api.get("investors/my-investments/");
                setItems(res.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-8">My Investments</h1>

                {loading && <p className="text-gray-400">Loading...</p>}
                {!loading && items.length === 0 && <p className="text-gray-400">No accepted investments yet.</p>}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((req) => {
                        const s = req.startup || {};
                        return (
                            <div key={req.id} className="bg-[#1A1F33] rounded-2xl p-6 shadow-lg border border-white/10">
                                <h2 className="text-xl font-semibold text-white">{s.name}</h2>
                                <p className="text-gray-300 mt-1">Amount Invested: <span className="font-semibold">₹{req.amount}</span></p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 text-sm rounded-full bg-green-600/20 text-green-300">Status: ACCEPTED</span>
                                    {s.funding_goal && (
                                        <span className="px-3 py-1 text-sm rounded-full bg-teal-600/20 text-teal-300">Goal: ₹{s.funding_goal}</span>
                                    )}
                                    {s.raised_amount && (
                                        <span className="px-3 py-1 text-sm rounded-full bg-indigo-600/20 text-indigo-300">Raised: ₹{s.raised_amount}</span>
                                    )}
                                </div>

                                {s.description && <p className="text-gray-400 mt-4 line-clamp-3">{s.description}</p>}

                                <div className="flex gap-3 mt-4">
                                    {s.website && (
                                        <a
                                            href={externalUrl(s.website)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                                        >
                                            <Globe size={16} /> Website
                                        </a>
                                    )}
                                    {s.pitch_deck && (
                                        <a
                                            href={fileUrl(s.pitch_deck)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30"
                                        >
                                            <FileText size={16} /> Pitch Deck
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
