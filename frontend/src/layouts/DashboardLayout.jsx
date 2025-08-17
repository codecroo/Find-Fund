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
        <div className="h-screen flex overflow-hidden bg-gray-900 text-white">
            {/* Sidebar */}
            <Sidebar role={role} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}
