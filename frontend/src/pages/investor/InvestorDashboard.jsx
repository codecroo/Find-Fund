import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import {
    Bookmark,
    Clock,
    CheckCircle,
    X,
    RefreshCw,
    Eye,
    Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvestorDashboard() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [requests, setRequests] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [savedCount, setSavedCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // modal for viewing single request details
    const [selectedRequest, setSelectedRequest] = useState(null);

    // modal to send a new request (send again)
    const [sendModal, setSendModal] = useState({ open: false, request: null, amount: "", sending: false });

    // toasts
    const [toasts, setToasts] = useState([]);
    const toastTimers = useRef({});

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!isAuth || storedRole !== "Investor") {
            setRole(null);
            return;
        }
        setUser(storedUser);
        setRole(storedRole);
        fetchAll();
        // cleanup
        return () => Object.values(toastTimers.current).forEach((t) => clearTimeout(t));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- Toast helpers ---------- */
    const addToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts((t) => [...t, { id, type, title, message }]);
        const timer = setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
            delete toastTimers.current[id];
        }, 4200);
        toastTimers.current[id] = timer;
    };
    const removeToast = (id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
        if (toastTimers.current[id]) {
            clearTimeout(toastTimers.current[id]);
            delete toastTimers.current[id];
        }
    };

    /* ---------- data fetchers ---------- */
    const fetchSavedCount = async () => {
        try {
            const res = await api.get("investors/saved/");
            const arr = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
            setSavedCount(arr.length);
        } catch (err) {
            console.warn("Saved count fetch failed (maybe endpoint missing)", err?.response?.status);
            setSavedCount(0);
        }
    };

    const fetchInvestments = async () => {
        try {
            const res = await api.get("investors/my-investments/");
            setInvestments(Array.isArray(res.data) ? res.data : res.data?.results ?? []);
        } catch (err) {
            console.warn("Failed to fetch investments", err?.response ?? err);
            setInvestments([]);
        }
    };

    // robust requests fetch — tries sensible endpoints used by your backend
    const tryGetRequests = async () => {
        const candidates = [
            "investors/requests/",
            "investors/my-requests/",
            "investors/requests/mine/",
            "requests/my/",
            "requests/",
        ];
        for (const ep of candidates) {
            try {
                const res = await api.get(ep);
                if (Array.isArray(res.data)) return res.data;
                if (res.data && Array.isArray(res.data.results)) return res.data.results;
            } catch (err) {
                // try next
            }
        }
        return [];
    };

    const fetchRequests = async () => {
        const data = await tryGetRequests();
        setRequests(data || []);
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchSavedCount(), fetchRequests(), fetchInvestments()]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchAll();
            addToast("success", "Refreshed", "Data is up to date");
        } catch (err) {
            addToast("error", "Refresh failed", "See console for details");
        } finally {
            setRefreshing(false);
        }
    };

    /* ---------- helpers ---------- */
    const pendingCount = requests.filter((r) => String(r.status).toLowerCase() === "pending").length;
    const acceptedCount =
        investments.length > 0 ? investments.length : requests.filter((r) => String(r.status).toLowerCase() === "accepted").length;
    const rejectedCount = requests.filter((r) => String(r.status).toLowerCase() === "rejected").length;
    const rejectedList = requests.filter((r) => String(r.status).toLowerCase() === "rejected");

    /* ---------- send again flow ---------- */
    const openSendModal = (r) => {
        setSendModal({ open: true, request: r, amount: r.amount ?? "", sending: false });
    };
    const closeSendModal = () => setSendModal({ open: false, request: null, amount: "", sending: false });

    const handleSendAgain = async () => {
        if (!sendModal.request) return;
        const r = sendModal.request;
        const startup = r.startup ?? {};
        const goal = Number(startup.funding_goal || 0);
        const raised = Number(startup.amount_raised ?? startup.raised_amount ?? 0);
        const remaining = Math.max(goal - raised, 0);

        const amountVal = Number(sendModal.amount);
        if (!amountVal || Number.isNaN(amountVal) || amountVal <= 0) {
            addToast("error", "Invalid amount", "Please enter a valid positive amount");
            return;
        }
        if (goal > 0 && amountVal > remaining) {
            addToast("error", "Too large", `Amount exceeds remaining: ₹${remaining.toLocaleString("en-IN")}`);
            return;
        }

        setSendModal((s) => ({ ...s, sending: true }));
        try {
            const payload = { startup_id: startup.id, amount: amountVal };
            await api.post("investors/requests/", payload);
            addToast("success", "Request sent", "Founder will review your resubmitted request");
            closeSendModal();
            await fetchAll();
        } catch (err) {
            console.error("Failed to send request", err);
            const server = err?.response?.data || err?.message || "Server error";
            addToast("error", "Send failed", typeof server === "string" ? server : JSON.stringify(server));
            setSendModal((s) => ({ ...s, sending: false }));
        }
    };

    /* ---------- UI ---------- */
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Welcome{user ? `, ${user}` : ""}</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Investor dashboard — quick stats and a view-only list of rejected requests. You can resubmit a request directly from here.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <Button onClick={handleRefresh} variant="secondary" size="default" className="flex items-center gap-2 w-full sm:w-auto justify-center">
                            <RefreshCw size={16} /> {refreshing ? "Refreshing..." : "Refresh"}
                        </Button>
                        <Button variant="ghost" onClick={() => { localStorage.clear(); window.location.href = "/signin"; }} className="w-full sm:w-auto">
                            Logout
                        </Button>
                    </div>
                </div>

                {/* stats: responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] p-4 sm:p-6 rounded-2xl border border-white/6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Saved</div>
                                <div className="text-2xl font-bold text-white">{savedCount}</div>
                            </div>
                            <div className="text-indigo-300"><Bookmark size={26} /></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Startups you've bookmarked</div>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] p-4 sm:p-6 rounded-2xl border border-white/6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Pending requests</div>
                                <div className="text-2xl font-bold text-white">{pendingCount}</div>
                            </div>
                            <div className="text-yellow-300"><Clock size={26} /></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Requests awaiting founder decision</div>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] p-4 sm:p-6 rounded-2xl border border-white/6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Accepted</div>
                                <div className="text-2xl font-bold text-white">{acceptedCount}</div>
                            </div>
                            <div className="text-green-300"><CheckCircle size={26} /></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Investments accepted by founders</div>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] p-4 sm:p-6 rounded-2xl border border-white/6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400">Rejected</div>
                                <div className="text-2xl font-bold text-white">{rejectedCount}</div>
                            </div>
                            <div className="text-red-300"><X size={26} /></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Requests rejected by founders</div>
                    </motion.div>
                </div>

                {/* rejected requests list (VIEW only + send again) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold text-white">Recently rejected requests</h2>
                        <div className="text-sm text-gray-400 hidden sm:block">You can view details here and resubmit a request if you want.</div>
                    </div>

                    {loading ? (
                        <p className="text-gray-400">Loading…</p>
                    ) : rejectedList.length === 0 ? (
                        <p className="text-gray-400">No rejected requests — nice job 👍</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {rejectedList.map((r) => {
                                const startup = r.startup ?? {};
                                return (
                                    <div
                                        key={r.id}
                                        className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] p-4 sm:p-6 rounded-2xl border border-white/6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-start gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-lg sm:text-xl font-semibold text-white truncate">{startup.name ?? "Startup"}</div>
                                                    <div className="text-sm text-gray-300 mt-1">{startup.industry ?? startup.category ?? ""}</div>
                                                </div>
                                            </div>

                                            {startup.description && (
                                                <div className="text-sm text-gray-300 mt-3 line-clamp-3">{startup.description}</div>
                                            )}

                                            <div className="mt-3 text-sm text-gray-300">
                                                <div>Amount: <span className="font-medium">₹{Number(r.amount).toLocaleString("en-IN")}</span></div>
                                                <div className="text-xs text-gray-400 mt-1">Date: {new Date(r.created_at ?? r.updated_at ?? Date.now()).toLocaleDateString()}</div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 flex gap-2 w-full sm:w-auto">
                                            <Button onClick={() => setSelectedRequest(r)} variant="outline" className="flex-1 sm:flex-none flex items-center gap-2 justify-center">
                                                <Eye size={14} /> <span className="hidden sm:inline">View</span>
                                            </Button>

                                            <Button onClick={() => openSendModal(r)} variant="primary" className="flex-1 sm:flex-none flex items-center gap-2 justify-center">
                                                <Send size={14} /> <span className="hidden sm:inline">Send Again</span>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
                    >
                        <motion.div
                            initial={{ y: 8, scale: 0.98 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 8, scale: 0.98 }}
                            className="w-full max-w-xl bg-[#0B1220] rounded-2xl p-6 shadow-2xl border border-white/6"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-semibold text-white">Request Details</h3>
                                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-white p-2 rounded-full">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-4 text-base text-gray-300 space-y-3">
                                <div><strong>Startup:</strong> {selectedRequest.startup?.name ?? "—"}</div>
                                <div><strong>Amount:</strong> ₹{Number(selectedRequest.amount).toLocaleString("en-IN")}</div>
                                <div><strong>Status:</strong> {selectedRequest.status ?? "—"}</div>
                                <div><strong>Submitted:</strong> {new Date(selectedRequest.created_at ?? Date.now()).toLocaleString()}</div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Send Again modal */}
            <AnimatePresence>
                {sendModal.open && sendModal.request && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4"
                    >
                        <motion.div
                            initial={{ y: 10, scale: 0.995 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 10, scale: 0.995 }}
                            className="w-full max-w-lg bg-[#0B1220] text-white rounded-2xl p-6 border border-white/6 shadow-2xl"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-semibold">Send Request — {sendModal.request.startup?.name ?? "Startup"}</h3>
                                <button onClick={closeSendModal} className="text-gray-400 hover:text-white p-2 rounded-full">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4 text-base text-gray-300">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Amount (INR)</label>
                                    <input
                                        type="number"
                                        value={sendModal.amount ?? ""}
                                        onChange={(e) => setSendModal((s) => ({ ...s, amount: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-xl bg-[#0F1724] border border-white/6 text-white"
                                        min="1"
                                    />
                                </div>

                                <div className="text-sm text-gray-400">
                                    Note: This will create a new request for the founder to review. You cannot reopen the previous rejected request — this submits a fresh one.
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                <Button variant="secondary" onClick={closeSendModal} className="w-full sm:w-auto">Cancel</Button>
                                <Button variant="primary" onClick={handleSendAgain} disabled={sendModal.sending} className="w-full sm:w-auto">
                                    <Send size={14} /> {sendModal.sending ? "Sending…" : "Send Request"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top-right toasts */}
            <div className="fixed top-4 right-4 z-60 flex flex-col gap-3 items-end px-2">
                <AnimatePresence initial={false}>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.26, ease: "easeOut" }}
                            className={`w-full max-w-xs p-3 rounded-xl shadow-2xl border flex items-start gap-3 pointer-events-auto ${t.type === "success"
                                ? "bg-gradient-to-r from-green-700/95 to-green-600/85 border-green-500/60 text-white"
                                : "bg-gradient-to-r from-red-700/95 to-red-600/85 border-red-500/60 text-white"
                                }`}
                        >
                            <div className="pt-0.5">
                                <div className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center">
                                    {t.type === "success" ? <CheckCircle size={18} /> : <X size={16} />}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <strong className="text-sm">{t.title}</strong>
                                    <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white text-xs">Close</button>
                                </div>
                                {t.message && <div className="text-xs mt-1 text-white/90">{t.message}</div>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
