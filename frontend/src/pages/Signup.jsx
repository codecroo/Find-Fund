import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Founder");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Refs for Enter navigation
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const roleRef = useRef(null);

    function validateForm() {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
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
            const res = await api.post("signup/", {
                username,
                password1: password,   // ✅ Django expects this
                password2: confirmPassword, // ✅ Django expects this
                role
            });

            if (res.data.message) {
                navigate("/signin");
            } else {
                setErrors({ general: res.data.error || "Signup failed" });
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.error) {
                // Django form errors come as dict
                setErrors({ general: JSON.stringify(error.response.data.error) });
            } else {
                setErrors({ general: "An error occurred while signing up" });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1525] text-white px-4">
            {/* Back to Home */}
            <div className="absolute top-6 left-6">
                <Link
                    to="/"
                    className="flex items-center text-sm text-indigo-400 hover:underline"
                >
                    <ArrowLeft size={16} className="mr-1" /> Back to Home
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-[#1A2236] p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/10"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

                {errors.general && (
                    <div className="mb-4 text-red-400 text-sm text-center">
                        {errors.general}
                    </div>
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
                {errors.username && (
                    <p className="text-red-400 text-sm mb-2">{errors.username}</p>
                )}

                {/* Password */}
                <input
                    ref={passwordRef}
                    className={`w-full p-3 mb-2 bg-[#0E1525] rounded-lg border ${errors.password ? "border-red-500" : "border-white/10"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            confirmPasswordRef.current?.focus();
                        }
                    }}
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mb-2">{errors.password}</p>
                )}

                {/* Confirm Password */}
                <input
                    ref={confirmPasswordRef}
                    className={`w-full p-3 mb-2 bg-[#0E1525] rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-white/10"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            roleRef.current?.focus();
                        }
                    }}
                />
                {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mb-2">{errors.confirmPassword}</p>
                )}

                {/* Role Selector */}
                <select
                    ref={roleRef}
                    className="w-full p-3 mb-4 bg-[#0E1525] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="Founder">Founder</option>
                    <option value="Investor">Investor</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-indigo-500 to-teal-400 p-3 rounded-lg font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                        }`}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
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