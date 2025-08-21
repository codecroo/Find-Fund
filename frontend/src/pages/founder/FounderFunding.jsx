import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button"; // using your custom button
import { Users, Banknote, UserCheck, UserX, Search, RefreshCw } from "lucide-react";

const FounderFunding = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [query, setQuery] = useState("");

    // Fetch investment requests
    const fetchRequests = async () => {
        setFetching(true);
        try {
            const res = await api.get("investors/founder/requests/");
            setRequests(res.data || []);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setFetching(false);
        }
    };

    // Refresh startups for amount_raised sync
    const refreshStartups = async () => {
        try {
            await api.get("startups/");
        } catch (err) {
            console.error("Failed to refresh startups", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDecision = async (id, decision) => {
        try {
            setLoading(true);
            await api.patch(`investors/founder/requests/${id}/`, { status: decision });
            await fetchRequests();
            await refreshStartups();
        } catch (err) {
            console.error("Failed to update request", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = requests.filter((r) =>
        query.trim()
            ? String(r.startup?.name || "").toLowerCase().includes(query.toLowerCase()) ||
            String(r.investor?.full_name || "").toLowerCase().includes(query.toLowerCase())
            : true
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">

                {/* Header (kept consistent with My Startups) */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Funding Requests</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Review and approve incoming investor requests — keep funding moving smoothly.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by startup or investor"
                                className="pl-12 pr-4 py-3 rounded-full bg-[#0F1724] border border-white/6 text-sm text-gray-200 w-[280px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        <Button
                            onClick={() => fetchRequests()}
                            variant="secondary"
                            size="default"
                            className="flex items-center gap-2"
                        >
                            <RefreshCw size={16} />
                            <span>{fetching ? "Refreshing" : "Refresh"}</span>
                        </Button>
                    </div>
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filtered.length > 0 ? (
                        filtered.map((req) => (
                            <div
                                key={req.id}
                                className="bg-gradient-to-br from-[#0E1220] to-[#121826]  p-8 rounded-2xl shadow-lg border border-white/10 
                        hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">🚀 {req.startup?.name}</h3>

                                <div className="space-y-2 text-gray-200">
                                    <p className="flex items-center gap-2">
                                        <Users size={18} className="text-indigo-400" />
                                        Founder: <span className="font-medium">{req.startup?.founder?.full_name || "—"}</span>
                                    </p>

                                    <p className="flex items-center gap-2">
                                        <UserCheck size={18} className="text-green-400" />
                                        Investor: <span className="font-medium">{req.investor?.full_name || "—"}</span>
                                    </p>

                                    <p className="flex items-center gap-2 text-lg font-semibold text-green-400 mt-4">
                                        <Banknote size={18} /> ₹{req.amount}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    {req.status === "pending" ? (
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() => handleDecision(req.id, "accepted")}
                                                disabled={loading}
                                                variant="primary"
                                                className="flex items-center gap-2"
                                            >
                                                <UserCheck size={16} /> Accept
                                            </Button>
                                            <Button
                                                onClick={() => handleDecision(req.id, "rejected")}
                                                disabled={loading}
                                                variant="danger"
                                                className="flex items-center gap-2"
                                            >
                                                <UserX size={16} /> Reject
                                            </Button>
                                        </div>
                                    ) : (
                                        <span
                                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide ${req.status === "accepted"
                                                ? "bg-green-600/20 text-green-400 border border-green-500/40"
                                                : "bg-red-600/20 text-red-400 border border-red-500/40"
                                                }`}
                                        >
                                            {req.status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-lg">No funding requests yet 🚫</p>
                    )}
                </div>
            </div>

        </DashboardLayout>
    );
};

export default FounderFunding;
