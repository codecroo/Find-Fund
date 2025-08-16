import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

export default function Sidebar({ role, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // mobile drawer
    const [collapsed, setCollapsed] = useState(false); // desktop collapse

    const menuItems = [
        { label: "Home", icon: <Home size={20} />, path: `/dashboard/${role.toLowerCase()}` },
        ...(role === "Founder"
            ? [
                { label: "My Startups", icon: <Rocket size={20} />, path: "/dashboard/founder/startups" },
                { label: "Funding Requests", icon: <DollarSign size={20} />, path: "/dashboard/founder/funding" },
            ]
            : []),
        ...(role === "Investor"
            ? [
                { label: "Browse Startups", icon: <Building2 size={20} />, path: "/dashboard/investor/startups" },
                { label: "My Investments", icon: <Briefcase size={20} />, path: "/dashboard/investor/investments" },
            ]
            : []),
        { label: "Logout", icon: <LogOut size={20} />, onClick: onLogout, danger: true },
    ];

    const renderMenu = (closeOnClick = false) =>
        menuItems.map((item, index) => {
            const isActive = item.path && location.pathname.startsWith(item.path);
            return (
                <button
                    key={index}
                    onClick={() => {
                        if (item.onClick) item.onClick();
                        else navigate(item.path);
                        if (closeOnClick) setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all
                        ${item.danger
                            ? "text-red-400 hover:text-red-500 hover:bg-red-500/10"
                            : isActive
                            ? "bg-gradient-to-r from-indigo-950 to-indigo-500 text-white shadow-md"
                                : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                        }`}
                >
                    {item.icon}
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                </button>
            );
        });

    return (
        <>
            {/* --- MOBILE TOPBAR (only shows icon) --- */}
            <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow">
                <button onClick={() => setIsOpen(true)}>
                    <Menu size={26} />
                </button>
            </div>

            {/* --- DESKTOP SIDEBAR (collapsible) --- */}
            <aside
                className={`hidden md:flex h-screen bg-gray-900 flex-col border-r border-gray-800 transition-all duration-300
                ${collapsed ? "w-17 p-3" : "w-64 p-4"}`}
            >
                <div className="flex justify-between items-center mb-6">
                    {!collapsed && <h2 className="text-2xl font-bold text-white">Dashboard</h2>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 text-gray-400 hover:text-white"
                    >
                        {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                    </button>
                </div>
                <nav className="space-y-2">{renderMenu()}</nav>
            </aside>

            {/* --- MOBILE DRAWER SIDEBAR --- */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 p-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white">Dashboard</h2>
                                <button onClick={() => setIsOpen(false)}>
                                    <X size={24} className="text-white" />
                                </button>
                            </div>
                            <nav className="space-y-2">{renderMenu(true)}</nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
