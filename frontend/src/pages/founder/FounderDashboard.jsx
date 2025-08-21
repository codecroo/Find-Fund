import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import {
    PlusCircle,
    RefreshCw,
    Banknote,
    Users,
    CheckCircle,
    Clock,
    FileText,
} from "lucide-react";

export default function FounderDashboard() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [startups, setStartups] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // auth guard
    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!isAuth || storedRole !== "Founder") {
            navigate("/signin");
        } else {
            setUser(storedUser);
            setRole(storedRole);
        }
    }, [navigate]);

    const getRaised = (s) => Number(s.amount_raised ?? s.raised_amount ?? 0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [sRes, rRes] = await Promise.all([
                api.get("startups/"),
                api.get("investors/founder/requests/"),
            ]);
            setStartups(Array.isArray(sRes.data) ? sRes.data : []);
            setRequests(Array.isArray(rRes.data) ? rRes.data : []);
        } catch (err) {
            console.error("Dashboard fetch failed", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const id = setInterval(() => {
            fetchData().catch(() => { });
        }, 15000);
        return () => clearInterval(id);
    }, [fetchData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchData();
        } finally {
            setRefreshing(false);
        }
    };

    const totalStartups = startups.length;
    const totalRaised = startups.reduce((acc, s) => acc + getRaised(s), 0);
    const pendingRequests = requests.filter((r) => r.status === "pending").length;
    const fullyFundedCount = startups.filter(
        (s) =>
            getRaised(s) >= Number(s.funding_goal || 0) && Number(s.funding_goal || 0) > 0
    ).length;

    const recentStartups = startups.slice(0, 4);
    const recentRequests = requests.slice(0, 5);

    if (!role) return null;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header: more breathing room and larger buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold text-white">
                            Welcome{user ? `, ${user}` : ""}
                        </h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Founder dashboard — quick overview of your startups and incoming funding
                            requests.
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-800/40 text-red-200 border border-red-700">
                        {error}
                    </div>
                )}

                {/* Stats grid: slightly more padding & gap for clarity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    <div className="bg-gradient-to-br from-[#0E1220] to-[#121826] rounded-2xl p-6 border border-white/6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Total Startups</div>
                                <div className="text-2xl font-semibold text-white mt-2">{totalStartups}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/3">
                                <Users size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">Manage and review your portfolio</div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0E1220] to-[#121826] rounded-2xl p-6 border border-white/6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Total Raised</div>
                                <div className="text-2xl font-semibold text-white mt-2">₹{Number(totalRaised).toLocaleString()}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/3">
                                <Banknote size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">Across all your active startups</div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0E1220] to-[#121826] rounded-2xl p-6 border border-white/6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Pending Requests</div>
                                <div className="text-2xl font-semibold text-white mt-2">{pendingRequests}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/3">
                                <Clock size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">Investor requests waiting for action</div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0E1220] to-[#121826] rounded-2xl p-6 border border-white/6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Fully Funded</div>
                                <div className="text-2xl font-semibold text-white mt-2">{fullyFundedCount}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/3">
                                <CheckCircle size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">Startups that reached or exceeded goals</div>
                    </div>
                </div>

                {/* Two-column content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Startups */}
                    <div className="bg-gradient-to-br from-[#0B1220] to-[#071026] rounded-2xl p-6 border border-white/6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Recent Startups</h3>
                            <Button
                                onClick={() => navigate("/dashboard/founder/startups")}
                                variant="ghost"
                                size="default"
                                className="text-sm px-3 py-2 rounded-full"
                            >
                                View all
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-gray-400">Loading startups...</div>
                        ) : recentStartups.length === 0 ? (
                            <div className="text-gray-400">No startups yet — add your first one.</div>
                        ) : (
                            <div className="space-y-4">
                                {recentStartups.map((s) => {
                                    const raised = getRaised(s);
                                    const goal = Number(s.funding_goal || 0);
                                    const progress = Math.min(goal === 0 ? 0 : (raised / goal) * 100, 100);
                                    return (
                                        <div key={s.id} className="p-4 bg-white/3 rounded-xl border border-white/6">
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold text-white truncate">{s.name}</div>
                                                    <div className="text-xs text-gray-400">{s.industry || "—"}</div>
                                                </div>
                                                <div className="text-sm text-gray-200">₹{raised.toLocaleString()}</div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="w-full h-2 rounded-full bg-white/6 overflow-hidden">
                                                    <div
                                                        className={`h-2 rounded-full ${progress >= 100 ? "bg-green-400" : "bg-indigo-500"}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                                                    <div>{Math.round(progress)}% funded</div>
                                                    <div>{goal ? `Goal: ₹${goal.toLocaleString()}` : "No goal set"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Requests */}
                    <div className="bg-gradient-to-br from-[#0B1220] to-[#071026] rounded-2xl p-6 border border-white/6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Recent Funding Requests</h3>
                            <Button
                                onClick={() => navigate("/dashboard/founder/funding")}
                                variant="ghost"
                                size="default"
                                className="text-sm px-3 py-2 rounded-full"
                            >
                                View all
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-gray-400">Loading requests...</div>
                        ) : recentRequests.length === 0 ? (
                            <div className="text-gray-400">No requests yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {recentRequests.map((r) => (
                                    <div key={r.id} className="p-3 bg-white/3 rounded-xl border border-white/6 flex items-start justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{r.startup?.name || "—"}</div>
                                            <div className="text-xs text-gray-400">{r.investor?.full_name || "Investor"}</div>
                                            <div className="text-xs text-gray-400 mt-1">₹{r.amount}</div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${r.status === "pending" ? "bg-yellow-600/20 text-yellow-300" : r.status === "accepted" ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"}`}>
                                                {r.status}
                                            </div>
                                            <div className="text-xs text-gray-400">{new Date(r.created_at || r.created || Date.now()).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
