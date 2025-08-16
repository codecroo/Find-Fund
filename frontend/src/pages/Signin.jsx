import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft } from "lucide-react";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Ref for Enter navigation
    const passwordRef = useRef(null);

    function validateForm() {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await api.post("signin/", { username, password });
            if (res.data.message) {
                localStorage.setItem("isAuthenticated", "true");
                navigate("/dashboard");
            } else {
                setErrors({ general: res.data.error || "Invalid credentials" });
            }
        } catch (error) {
            console.error(error);
            setErrors({ general: "An error occurred while signing in" });
        } finally {
            setLoading(false);
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

                {errors.general && (
                    <div className="mb-4 text-red-400 text-sm text-center">{errors.general}</div>
                )}

                {/* Username */}
                <input
                    autoFocus
                    className={`w-full p-3 mb-2 bg-[#0E1525] rounded-lg border ${errors.username ? "border-red-500" : "border-white/10"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            passwordRef.current?.focus();
                        }
                    }}
                />
                {errors.username && <p className="text-red-400 text-sm mb-2">{errors.username}</p>}

                {/* Password */}
                <input
                    ref={passwordRef}
                    className={`w-full p-3 mb-2 bg-[#0E1525] rounded-lg border ${errors.password ? "border-red-500" : "border-white/10"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-400 text-sm mb-2">{errors.password}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-indigo-500 to-teal-400 p-3 rounded-lg font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                        }`}
                >
                    {loading ? "Signing In..." : "Login"}
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
