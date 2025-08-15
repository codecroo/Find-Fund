import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft } from "lucide-react";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await api.post("signin/", { username, password });
            if (res.data.message) {
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard");
            } else {
                alert(res.data.error || "Invalid credentials");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while signing in");
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1525] text-white px-4">
            {/* Back to Home */}
            <div className="absolute top-6 left-6">
                <Link to="/" className="flex items-center text-sm text-indigo-400 hover:underline">
                    <ArrowLeft size={16} className="mr-1" /> Back to Home
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-[#1A2236] p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/10"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

                <input
                    className="w-full p-3 mb-4 bg-[#0E1525] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="w-full p-3 mb-6 bg-[#0E1525] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-gradient-to-r from-indigo-500 to-teal-400 p-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Login
                </button>

                <p className="text-sm text-center mt-6 text-gray-400">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-indigo-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
