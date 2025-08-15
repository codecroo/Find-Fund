import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../utils/api";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Founder");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await apiPost("/signup/", { username, password, role });
        if (res.message) {
            navigate("/signin");
        } else {
            alert(res.error || "Signup failed");
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
                <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

                <input
                    className="w-full p-3 mb-4 bg-[#0E1525] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="w-full p-3 mb-4 bg-[#0E1525] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                {/* Role Selector */}
                <select
                    className="w-full p-3 mb-6 bg-[#0E1525] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                >
                    <option value="Founder">Founder</option>
                    <option value="Investor">Investor</option>
                </select>

                <button
                    className="w-full bg-gradient-to-r from-indigo-500 to-teal-400 p-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Sign Up
                </button>

                <p className="text-sm text-center mt-6 text-gray-400">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-indigo-400 hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
}
