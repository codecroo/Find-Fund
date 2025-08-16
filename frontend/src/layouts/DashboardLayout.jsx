import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!isAuth) {
            navigate("/signin");
        } else {
            setUser(storedUser);
            setRole(storedRole);
        }
    }, [navigate]);

    function handleLogout() {
        localStorage.clear();
        navigate("/signin");
    }

    if (!role) return null; // wait until role loads

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* ✅ Sidebar works for both Founder & Investor */}
            <Sidebar role={role} onLogout={handleLogout} />

            {/* ✅ Main Content (different per page) */}
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}