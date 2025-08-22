import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import {
    FileText,
    Globe,
    RefreshCw,
    Percent,
    ChartPie,
    X,
    CheckCircle,
    Banknote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvestorInvestments() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // toast system (top-right)
    const [toasts, setToasts] = useState([]); // { id, type, title, message }
    const toastTimers = useRef({});

    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");
    const fileUrl = (p) => (!p ? "" : /^https?:\/\//i.test(p) ? p : `${API_BASE}/${String(p).replace(/^\/+/, "")}`);
    const externalUrl = (u) => (!u ? "" : /^https?:\/\//i.test(u) ? u : `https://${u}`);

    useEffect(() => {
        fetchItems();
        return () => {
            Object.values(toastTimers.current).forEach((t) => clearTimeout(t));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await api.get("investors/my-investments/");
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load investments", err);
            addToast("error", "Load failed", "Could not load investments — check console.");
        } finally {
            setLoading(false);
        }
    };

    // small helper: compute investor's equity share from this investment
    const computeInvestorEquity = (investment) => {
        const s = investment.startup || {};
        const amount = Number(investment.amount ?? 0);
        const fundingGoal = Number(s.funding_goal ?? s.goal ?? 0);
        const offeredEquity = Number(s.equity ?? 0); // percent for full goal
        if (!fundingGoal || fundingGoal <= 0 || !offeredEquity || offeredEquity <= 0) return null;
        const equity = (amount / fundingGoal) * offeredEquity;
        return equity;
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">My Investments</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            All accepted investments you made. Track amounts, see startup details and your estimated equity.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            onClick={fetchItems}
                            variant="secondary"
                            size="default"
                            className="flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            <RefreshCw size={16} />
                            <span>{loading ? "Refreshing..." : "Refresh"}</span>
                        </Button>
                    </div>
                </div>

                {/* Empty / Loading */}
                {loading ? (
                    <p className="text-center text-gray-400">Loading investments...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-400">No accepted investments yet.</p>
                ) : (
                    // responsive grid: 1 column on mobile, 2 on md, 3 on xl — each card has comfortable min width
                    <div
                        className="mx-auto"
                        style={{
                            display: "grid",
                            gap: 24,
                            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                            alignItems: "start",
                        }}
                    >
                        {items.map((req) => {
                            const s = req.startup || {};
                            const invested = Number(req.amount ?? 0);
                            const fundingGoal = Number(s.funding_goal ?? s.goal ?? 0);
                            const yourEquity = computeInvestorEquity(req); // may be null
                            const raised = Number(s.raised_amount ?? s.amount_raised ?? 0);
                            const progressPct = fundingGoal && fundingGoal > 0 ? Math.min((raised / fundingGoal) * 100, 100) : 0;

                            return (
                                <article
                                    key={req.id}
                                    className="bg-gradient-to-br from-[#0F1622] to-[#0B1220] rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/6 min-h-[240px] flex flex-col justify-between"
                                    style={{ width: "100%" }}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h2 className="text-lg sm:text-2xl font-semibold text-white truncate">{s.name || "Unknown startup"}</h2>
                                                {s.industry && <p className="text-gray-400 text-sm mt-1">{s.industry}</p>}
                                            </div>
                                            <div className="inline-flex items-center gap-2 text-sm text-gray-300">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 text-green-200">
                                                    <CheckCircle size={14} /> ACCEPTED
                                                </span>
                                            </div>
                                        </div>

                                        {/* metrics */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-teal-600/10 text-teal-200 text-sm font-semibold">
                                                <Banknote size={14} /> {fundingGoal ? `Goal: ₹${fundingGoal.toLocaleString("en-IN")}` : "Goal unset"}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-indigo-600/10 text-indigo-200 text-sm font-semibold">
                                                <ChartPie size={14} /> Raised: ₹{raised.toLocaleString("en-IN")}
                                            </span>

                                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-pink-600/10 text-pink-200 text-sm">
                                                <Percent size={14} /> {s.equity ? `${s.equity}% for full goal` : "Equity unset"}
                                            </span>
                                        </div>

                                        {/* description */}
                                        {s.description && (
                                            <p className="text-gray-300 text-sm leading-relaxed mt-4 line-clamp-3">{s.description}</p>
                                        )}

                                        {/* progress bar */}
                                        <div className="mt-4">
                                            <div className="w-full h-2 rounded-full bg-white/6 overflow-hidden">
                                                <div
                                                    className={`h-2 rounded-full ${progressPct >= 100 ? "bg-green-400" : "bg-indigo-500"}`}
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                                                <div>{Math.round(progressPct)}% funded</div>
                                                <div>Invested: <span className="font-medium text-white">₹{invested.toLocaleString("en-IN")}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* bottom actions */}
                                    <div className="mt-4 md:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex gap-2 flex-wrap">
                                            {s.website && (
                                                <a
                                                    href={externalUrl(s.website)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 text-sm"
                                                >
                                                    <Globe size={14} /> <span className="hidden sm:inline">Website</span>
                                                </a>
                                            )}

                                            {s.pitch_deck && (
                                                <a
                                                    href={fileUrl(s.pitch_deck)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 text-sm"
                                                >
                                                    <FileText size={14} /> <span className="hidden sm:inline">Pitch Deck</span>
                                                </a>
                                            )}
                                        </div>

                                        <div className="text-right text-sm">
                                            {yourEquity !== null ? (
                                                <div className="text-xs text-gray-300">Your estimated equity</div>
                                            ) : (
                                                <div className="text-xs text-gray-400">Equity estimate unavailable</div>
                                            )}
                                            <div className="text-lg font-semibold text-white">{yourEquity !== null ? `${yourEquity.toFixed(2)}%` : "—"}</div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* TOP-RIGHT TOASTS */}
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
