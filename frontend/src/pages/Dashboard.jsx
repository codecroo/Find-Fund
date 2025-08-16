import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("username");

        if (!isAuth) {
            navigate("/signin");
        } else {
            setUser(storedUser || "User");
        }
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        navigate("/signin");
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user || "..."}</h1>
                <p className="mb-6">This is your dashboard. You can add more features here later.</p>
                <button
                    onClick={handleLogout}
                    className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
