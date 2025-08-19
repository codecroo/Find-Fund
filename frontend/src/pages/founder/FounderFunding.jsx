import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api"; // ✅ centralized axios instance

const FounderFunding = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch investment requests
    const fetchRequests = async () => {
        try {
            const res = await api.get("investors/founder/requests/");
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    // ✅ Fetch founder startups (so we refresh raised amount too)
    const refreshStartups = async () => {
        try {
            await api.get("startups/");
            // ⚡ assuming you already have MyStartups consuming this endpoint
            // The fetch will update cache / global state if you use React Query or context
            // If not using global state, you can pass a prop setter from parent instead
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

            // 🔄 Refresh requests list
            await fetchRequests();

            // 🔄 Refresh startups so amount_raised updates in MyStartups page
            await refreshStartups();

        } catch (err) {
            console.error("Failed to update request", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-8 text-indigo-700">Funding Requests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-gradient-to-r from-[#1A1F33] to-[#141826] p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">🚀 {req.startup.name}</h3>
                            <p className="text-white mb-1">
                                👤 Founder: <span className="font-medium">{req.startup.founder?.full_name}</span>
                            </p>
                            <p className="text-white mb-1">
                                💼 Investor: <span className="font-medium">{req.investor?.full_name}</span>
                            </p>
                            <p className="text-lg font-semibold text-green-600 mt-2 mb-4">
                                💰 Amount: ₹{req.amount}
                            </p>

                            {/* Status / Actions */}
                            {req.status === "pending" ? (
                                <div className="flex gap-4">
                                    <button
                                        disabled={loading}
                                        onClick={() => handleDecision(req.id, "accepted")}
                                        className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        ✅ Accept
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => handleDecision(req.id, "rejected")}
                                        className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        ❌ Reject
                                    </button>
                                </div>
                            ) : (
                                <span
                                    className={`inline-block px-3 py-1 rounded-lg text-white font-semibold ${req.status === "accepted"
                                        ? "bg-green-600/70"
                                        : "bg-red-600/70"
                                        }`}
                                >
                                    {req.status.toUpperCase()}
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-lg">No funding requests yet 🚫</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FounderFunding;