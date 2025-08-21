import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button"; // using your custom button
import { Users, Banknote, UserCheck, UserX, Search, RefreshCw, CheckCircle, X } from "lucide-react";

const FounderFunding = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [query, setQuery] = useState("");

    // compact toasts
    const [toasts, setToasts] = useState([]); // { id, type, title, message }
    const toastTimers = useRef({});

    const addToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts((t) => [...t, { id, type, title, message }]);

        // auto remove
        const timer = setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
            delete toastTimers.current[id];
        }, 3200);

        toastTimers.current[id] = timer;
        return id;
    };

    const removeToast = (id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
        if (toastTimers.current[id]) {
            clearTimeout(toastTimers.current[id]);
            delete toastTimers.current[id];
        }
    };

    // Fetch investment requests
    const fetchRequests = async () => {
        setFetching(true);
        try {
            const res = await api.get("investors/founder/requests/");
            setRequests(Array.isArray(res.data) ? res.data : res.data || []);
        } catch (err) {
            console.error("Failed to fetch requests", err);
            addToast("error", "Load failed", "Could not fetch requests (see console)");
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
            // no toast — optional
        }
    };

    useEffect(() => {
        fetchRequests();
        // cleanup timers on unmount
        return () => {
            Object.values(toastTimers.current).forEach((t) => clearTimeout(t));
        };
    }, []);

    const handleDecision = async (id, decision) => {
        try {
            setLoading(true);
            await api.patch(`investors/founder/requests/${id}/`, { status: decision });

            // success toast
            addToast("success", `Request ${decision}`, `Request ${decision} successfully.`);
            // refresh local list & startups
            await fetchRequests();
            await refreshStartups();
        } catch (err) {
            console.error("Failed to update request", err);
            const serverMsg =
                err?.response?.data?.error ||
                err?.response?.data ||
                err?.message ||
                "Server error";
            addToast("error", "Update failed", typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
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

                        <Button onClick={() => fetchRequests()} variant="secondary" size="default" className="flex items-center gap-2">
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
                                className="bg-gradient-to-br from-[#0E1220] to-[#121826] p-8 rounded-2xl shadow-lg border border-white/10"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">{req.startup?.name || "Startup"}</h3>

                                <div className="space-y-2 text-gray-200">
                                    <p className="flex items-center gap-2">
                                        <Users size={18} className="text-indigo-400" />
                                        Founder: <span className="font-medium">{req.startup?.founder?.full_name || "—"}</span>
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
                        <p className="text-gray-500 text-lg">No funding requests yet</p>
                    )}
                </div>
            </div>

            {/* COMPACT TOASTS (top-right) */}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end px-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        className={`w-full max-w-xs p-2 rounded-lg shadow-lg border flex items-center gap-3 text-sm pointer-events-auto
              ${t.type === "success" ? "bg-green-600/95 text-white border-green-500/40" : "bg-red-600/95 text-white border-red-500/40"}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center">
                            {t.type === "success" ? <CheckCircle size={16} /> : <X size={14} />}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{t.title}</div>
                            {t.message && <div className="text-xs text-white/90 mt-0.5">{t.message}</div>}
                        </div>
                        <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white text-xs px-2 py-1">
                            Close
                        </button>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default FounderFunding;