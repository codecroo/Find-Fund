// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Home,
    Rocket,
    DollarSign,
    Briefcase,
    LogOut,
    Building2,
    Menu,
    ChevronLeft,
    ChevronRight,
    X,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // <--- added for mobile animations

/**
 * Modern Sidebar
 * - responsive: mobile drawer + desktop collapsible
 * - preserves active route highlighting
 */
export default function Sidebar({ role: propRole, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false); // mobile drawer open
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem("sidebar_collapsed") === "true";
        } catch {
            return false;
        }
    });

    const role = propRole || localStorage.getItem("role");

    useEffect(() => {
        try {
            localStorage.setItem("sidebar_collapsed", String(collapsed));
        } catch { }
    }, [collapsed]);

    const menuItems = [
        { label: "Home", icon: <Home size={18} />, path: `/dashboard/${role?.toLowerCase()}` },

        ...(role === "Founder"
            ? [
                { label: "My Startups", icon: <Rocket size={18} />, path: "/dashboard/founder/startups" },
                { label: "Funding Requests", icon: <DollarSign size={18} />, path: "/dashboard/founder/funding" },
                { label: "Profile", icon: <User size={18} />, path: "/dashboard/founder/profile" },
            ]
            : []),

        ...(role === "Investor"
            ? [
                { label: "Browse Startups", icon: <Building2 size={18} />, path: "/dashboard/investor/startups" },
                { label: "Saved Startups", icon: <Rocket size={18} />, path: "/dashboard/investor/saved" },
                { label: "My Investments", icon: <Briefcase size={18} />, path: "/dashboard/investor/investments" },
                { label: "Profile", icon: <User size={18} />, path: "/dashboard/investor/profile" },
            ]
            : []),

        { label: "Logout", icon: <LogOut size={18} />, onClick: onLogout, danger: true },
    ];

    const handleNav = (item, closeOnMobile = false) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.path) {
            navigate(item.path);
        }
        if (closeOnMobile) setIsOpen(false);
    };

    const renderItem = (item, idx) => {
        const isActive = item.path && location.pathname === item.path;
        const baseBtn = `w-full flex items-center ${collapsed ? "justify-center gap-0 px-0" : "justify-start gap-3 px-3"} rounded-lg py-2 transition-colors text-sm font-medium focus:outline-none`;

        const activeClass =
            "bg-indigo-600/18 text-white border-l-4 border-indigo-500 pl-[calc(0.75rem-0.25rem)]";
        const normalClass = "text-gray-300 hover:bg-white/5 hover:text-white";

        return (
            <button
                key={idx}
                onClick={() => handleNav(item, true)}
                title={collapsed ? item.label : undefined}
                className={`${baseBtn} ${item.danger ? "text-red-400 hover:bg-red-500/8 hover:text-red-400" : isActive ? activeClass : normalClass}`}
                aria-current={isActive ? "page" : undefined}
            >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
        );
    };

    // mobile item renderer (reuses same active logic)
    const renderMobileItem = (item, i) => {
        const isActive = item.path && location.pathname === item.path;
        return (
            <button
                key={i}
                onClick={() => handleNav(item, true)}
                className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg w-full text-left
                    ${item.danger ? "text-red-400 hover:bg-red-500/8 hover:text-red-400" : isActive ? "bg-indigo-600/18 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
                <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                <span className="truncate">{item.label}</span>
            </button>
        );
    };

    return (
        <>
            {/* Mobile topbar button */}
            <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-[#071026] to-[#07182a] px-4 py-2 border-b border-white/5">
                <button aria-label="Open menu" onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-white/6">
                    <Menu size={20} />
                </button>
            </div>

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:flex md:flex-col h-screen bg-gradient-to-b from-[#071026] to-[#071826] border-r border-white/6 transition-all duration-200
        ${collapsed ? "w-22 px-3" : "w-64 px-5"}`}
            >
                <div className="flex items-center justify-between py-4">
                    {!collapsed ? (
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="text-white font-semibold">Dashboard</div>
                                <div className="text-xs text-gray-400">Welcome back</div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex items-center justify-center">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 grid place-items-center text-indigo-300 font-bold">
                                {(localStorage.getItem("username") || "U").charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}

                    <button
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        onClick={() => setCollapsed((c) => !c)}
                        className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5"
                    >
                        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-2 space-y-1">
                    {menuItems.map(renderItem)}
                </nav>

                <div className="py-4">
                    {!collapsed ? (
                        <div className="text-xs text-gray-400">
                            <div>Signed in as</div>
                            <div className="text-white font-medium truncate">{localStorage.getItem("username") ?? "User"}</div>
                        </div>
                    ) : (
                        <div className="flex justify-center text-gray-400 text-xs"> </div>
                    )}
                </div>
            </aside>

            {/* MOBILE drawer — replaced with animated version that reuses active logic */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 z-50 h-full w-72 bg-[#071026] p-4 md:hidden shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-white font-semibold">Dashboard</div>
                                    <div className="text-xs text-gray-300 mt-1">
                                        Signed in as <span className="text-white font-medium ml-1">{localStorage.getItem("username") ?? role}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-white/6" aria-label="Close menu">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-2">
                                {menuItems.map(renderMobileItem)}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
