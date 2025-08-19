import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api"; // ✅ use centralized axios instance

const FounderFunding = () => {
    const [requests, setRequests] = useState([]);

    // ✅ Fetch investment requests for founder
    const fetchRequests = async () => {
        try {
            const res = await api.get("investors/founder/requests/");
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // ✅ Handle accept/reject
    const handleDecision = async (id, decision) => {
        try {
            await api.patch(`investors/founder/requests/${id}/`, {
                status: decision,
            });
            fetchRequests(); // refresh after action
        } catch (err) {
            console.error("Failed to update request", err);
        }
    };

    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-8 text-indigo-700">
                Funding Requests
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-gradient-to-r from-[#1A1F33] to-[#141826] p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                🚀 {req.startup.name}
                            </h3>
                            <p className="text-white mb-1">
                                👤 Founder:{" "}
                                <span className="font-medium">
                                    {req.startup.founder.full_name}
                                </span>
                            </p>
                            <p className="text-white mb-1">
                                💼 Investor:{" "}
                                <span className="font-medium">
                                    {req.investor.full_name}
                                </span>
                            </p>
                            <p className="text-lg font-semibold text-green-600 mt-2 mb-4">
                                💰 Amount: ${req.amount}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() =>
                                        handleDecision(req.id, "accepted")
                                    }
                                    className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all"
                                >
                                    ✅ Accept
                                </button>
                                <button
                                    onClick={() =>
                                        handleDecision(req.id, "rejected")
                                    }
                                    className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all"
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-lg">
                        No funding requests yet 🚫
                    </p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FounderFunding;