import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Home,
    Rocket,
    DollarSign,
    Briefcase,
    LogOut,
    Building2
} from "lucide-react";

export default function Sidebar({ role, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            label: "Home",
            icon: <Home size={20} />,
            path: `/dashboard/${role.toLowerCase()}`
        },
        ...(role === "Founder"
            ? [
                {
                    label: "My Startups",
                    icon: <Rocket size={20} />,
                    path: "/dashboard/founder/startups"
                },
                {
                    label: "Funding Requests",
                    icon: <DollarSign size={20} />,
                    path: "/dashboard/founder/funding"
                }
            ]
            : []),
        ...(role === "Investor"
            ? [
                {
                    label: "Browse Startups",
                    icon: <Building2 size={20} />,
                    path: "/dashboard/investor/startups"
                },
                {
                    label: "My Investments",
                    icon: <Briefcase size={20} />,
                    path: "/dashboard/investor/investments"
                }
            ]
            : []),
        {
            label: "Logout",
            icon: <LogOut size={20} />,
            onClick: onLogout,
            danger: true
        }
    ];

    return (
        <motion.aside
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-64 h-screen bg-gray-900/90 backdrop-blur-xl shadow-xl p-6 space-y-6 rounded-r-2xl border-r border-gray-800"
        >
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-extrabold text-white mb-6 tracking-wide"
            >
                Dashboard
            </motion.h2>

            <nav className="space-y-2">
                {menuItems.map((item, index) => {
                    const isActive = item.path && location.pathname.startsWith(item.path);

                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.04, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={item.onClick || (() => navigate(item.path))}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all
                                ${item.danger
                                    ? "text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                    : isActive
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                        : "text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10"
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </motion.button>
                    );
                })}
            </nav>
        </motion.aside>
    );
}
