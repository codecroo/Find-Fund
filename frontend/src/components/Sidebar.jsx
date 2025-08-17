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
    MessageSquare,
    User,
} from "lucide-react";

export default function Sidebar({ role: propRole, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // mobile drawer
    const [collapsed, setCollapsed] = useState(false); // desktop collapse

    const role = propRole || localStorage.getItem("role");

    const menuItems = [
        { label: "Home", icon: <Home size={20} />, path: `/dashboard/${role?.toLowerCase()}` },

        ...(role === "Founder"
            ? [
                { label: "My Startups", icon: <Rocket size={20} />, path: "/dashboard/founder/startups" },
                { label: "Funding Requests", icon: <DollarSign size={20} />, path: "/dashboard/founder/funding" },
                { label: "Messages", icon: <MessageSquare size={20} />, path: "/dashboard/founder/messages" },
                { label: "Profile", icon: <User size={20} />, path: "/dashboard/founder/profile" },
            ]
            : []),

        ...(role === "Investor"
            ? [
                { label: "Browse Startups", icon: <Building2 size={20} />, path: "/dashboard/investor/startups" },
                { label: "Saved Startups", icon: <Rocket size={20} />, path: "/dashboard/investor/saved" },
                { label: "My Investments", icon: <Briefcase size={20} />, path: "/dashboard/investor/investments" },
                { label: "Messages", icon: <MessageSquare size={20} />, path: "/dashboard/investor/messages" },
                { label: "Profile", icon: <User size={20} />, path: "/dashboard/investor/profile" },
            ]
            : []),

        { label: "Logout", icon: <LogOut size={20} />, onClick: onLogout, danger: true },
    ];

    const renderMenu = (closeOnClick = false) =>
        menuItems.map((item, index) => {
            const isActive = item.path && location.pathname === item.path;

            return (
                <button
                    key={index}
                    title={collapsed ? item.label : ""}
                    onClick={() => {
                        if (item.onClick) item.onClick();
                        else navigate(item.path);
                        if (closeOnClick) setIsOpen(false);
                    }}
                    className={`relative flex items-center gap-3 w-full px-3 py-2 rounded-lg
            text-sm font-medium transition-all
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-gray-900
            ${item.danger
                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-500"
                            : isActive
                                ? "bg-indigo-600/20 text-white border-l-4 border-indigo-500"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                </button>
            );
        });

    return (
        <>
            {/* MOBILE TOPBAR */}
            <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow">
                <button onClick={() => setIsOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside
                className={`hidden md:flex h-screen  bg-gray-900 flex-col border-r border-gray-800 transition-all duration-300
          ${collapsed ? "w-18 p-3" : "w-60 p-4"}`}
            >
                <div className="flex justify-around text-center items-center mb-6">

                    {!collapsed && <h1 className="text-lg font-semibold text-white">Dashboard</h1>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 text-gray-400 hover:text-white transition"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <nav className="space-y-2">{renderMenu()}</nav>
            </aside>

            {/* MOBILE DRAWER */}
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
                            transition={{ duration: 0.25 }}
                            className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 p-4 shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Dashboard</h2>
                                <button onClick={() => setIsOpen(false)}>
                                    <X size={22} className="text-white" />
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
