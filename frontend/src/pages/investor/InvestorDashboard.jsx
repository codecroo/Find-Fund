import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function InvestorDashboard() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!isAuth || storedRole !== "Investor") {
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

    if (!role) return null;

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <Sidebar role={role} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">Welcome, {user}</h1>
                <p className="text-gray-400 mb-6">
                    You are logged in as <span className="text-indigo-400">{role}</span>.
                </p>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">Investor Dashboard</h2>
                    <p>Browse startups and manage your investments here.</p>
                </div>
            </main>
        </div>
    );
}
