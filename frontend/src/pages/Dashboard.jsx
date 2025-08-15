import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            const res = await apiGet("/check-auth/");
            if (!res.authenticated) {
                localStorage.removeItem("isAuthenticated");
                navigate("/signin");
            } else {
                setUser(res.username);
            }
        }
        fetchUser();
    }, [navigate]);

    async function handleLogout() {
        await apiPost("/signout/", {});
        localStorage.removeItem("isAuthenticated");
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
