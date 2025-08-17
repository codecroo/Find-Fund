import { useState, useEffect } from "react";
import { PlusCircle, X, Pencil, Trash2, Globe, FileText } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/ui/Button";
import api from "../../utils/api"; // axios instance

export default function FounderStartups() {
    const [startups, setStartups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStartup, setEditingStartup] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [newStartup, setNewStartup] = useState(getEmptyStartup());

    // no process.* here; Vite-style env with fallback
    const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:8000").replace(/\/+$/, "");

    function fileUrl(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `${API_BASE}/${String(path).replace(/^\/+/, "")}`;
    }

    function externalUrl(url) {
        if (!url) return "";
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }

    function getEmptyStartup() {
        return {
            name: "",
            industry: "",
            stage: "",
            funding_goal: "",        // required (frontend validates)
            description: "",
            website: "",             // keep as "" so we can clear
            team_size: "",
            location: "",
            pitch_deck: null,        // File object when chosen
        };
    }

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        try {
            const res = await api.get("startups/");
            setStartups(res.data);
        } catch (err) {
            console.error("Failed to fetch startups", err);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newStartup.name.trim()) newErrors.name = "Startup Name is required";
        if (!newStartup.stage) newErrors.stage = "Please select a stage";

        // funding_goal REQUIRED and positive
        if (!newStartup.funding_goal || Number(newStartup.funding_goal) <= 0) {
            newErrors.funding_goal = "Funding Goal is required and must be positive";
        }

        if (newStartup.team_size && Number(newStartup.team_size) <= 0) {
            newErrors.team_size = "Team Size must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();

            // Always send requireds
            formData.append("name", newStartup.name);
            formData.append("stage", newStartup.stage);
            formData.append("funding_goal", newStartup.funding_goal);

            // Optional text/number fields
            ["industry", "description", "team_size", "location"].forEach((f) => {
                if (newStartup[f] !== undefined && newStartup[f] !== null) {
                    formData.append(f, newStartup[f]);
                }
            });

            // Website: append even if empty string to CLEAR it on update
            formData.append("website", newStartup.website || "");

            // Pitch deck: ONLY append if a real File selected (prevents 400)
            if (newStartup.pitch_deck instanceof File) {
                formData.append("pitch_deck", newStartup.pitch_deck);
            }

            let res;
            if (editingStartup) {
                res = await api.put(`startups/${editingStartup.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setStartups((prev) => prev.map((s) => (s.id === editingStartup.id ? res.data : s)));
            } else {
                res = await api.post("startups/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setStartups((prev) => [...prev, res.data]);
            }
            handleClose();
        } catch (err) {
            console.error("Failed to save startup", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this startup?")) return;
        try {
            await api.delete(`startups/${id}/`);
            setStartups((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Failed to delete startup", err.response?.data || err);
        }
    };

    const handleEdit = (startup) => {
        setEditingStartup(startup);
        setNewStartup({
            // normalize values so inputs show correctly
            name: startup.name || "",
            industry: startup.industry || "",
            stage: startup.stage || "",
            funding_goal: startup.funding_goal ?? "", // keep as string/number
            description: startup.description || "",
            website: startup.website || "",           // "" so clearing works
            team_size: startup.team_size ?? "",
            location: startup.location || "",
            pitch_deck: null,                         // only send if user chooses a new File
        });
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingStartup(null);
        setNewStartup(getEmptyStartup());
        setErrors({});
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">My Startups</h1>
                    <Button className="gap-2" variant="primary" onClick={() => setShowForm(true)}>
                        <PlusCircle size={20} />
                        Add Startup
                    </Button>
                </div>

                {/* Empty State */}
                {startups.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-400">
                        <p className="text-lg">No startups added yet 🚀</p>
                        <p className="mt-2">
                            Click{" "}
                            <span
                                onClick={() => setShowForm(true)}
                                className="text-indigo-400 hover:underline cursor-pointer"
                            >
                                Add Startup
                            </span>{" "}
                            to create your first one.
                        </p>
                    </div>
                )}

                {/* Startup List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {startups.map((startup) => (
                        <div
                            key={startup.id}
                            className="bg-[#1A1F33] rounded-2xl p-6 shadow-lg border border-white/10 hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-1">{startup.name}</h2>
                                    <p className="text-gray-400 text-sm">{startup.industry}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(startup)}
                                        className="p-2 rounded-full hover:bg-indigo-600/20 text-indigo-400"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(startup.id)}
                                        className="p-2 rounded-full hover:bg-red-600/20 text-red-400"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-gray-300">
                                {startup.stage && <p>📌 Stage: {startup.stage}</p>}
                                {startup.description && <p className="line-clamp-3">{startup.description}</p>}

                                {/* funding_goal always shown if present */}
                                {startup.funding_goal && (
                                    <p className="text-teal-400 font-semibold">💰 Goal: ₹{startup.funding_goal}</p>
                                )}

                                {startup.team_size && <p>👥 Team Size: {startup.team_size}</p>}
                                {startup.location && <p>📍 Location: {startup.location}</p>}

                                {startup.website && (
                                    <a
                                        href={externalUrl(startup.website)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                                    >
                                        <Globe size={14} /> Website
                                    </a>
                                )}

                                {startup.pitch_deck && (
                                    <p>
                                        <a
                                            href={fileUrl(startup.pitch_deck)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-purple-400 hover:underline"
                                        >
                                            <FileText size={14} /> Pitch Deck
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add / Edit Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#121826] p-6 rounded-2xl w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-bold text-white mb-5">
                                {editingStartup ? "Edit Startup" : "Add Startup"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Startup Name"
                                    value={newStartup.name}
                                    onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                                <input
                                    type="text"
                                    placeholder="Industry"
                                    value={newStartup.industry}
                                    onChange={(e) => setNewStartup({ ...newStartup, industry: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />

                                <select
                                    value={newStartup.stage}
                                    onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                >
                                    <option value="">Select Stage</option>
                                    <option value="Idea">Idea</option>
                                    <option value="Prototype">Prototype</option>
                                    <option value="MVP">MVP</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B">Series B</option>
                                </select>
                                {errors.stage && <p className="text-red-500 text-xs">{errors.stage}</p>}

                                <input
                                    type="number"
                                    placeholder="Funding Goal (INR)"
                                    value={newStartup.funding_goal}
                                    onChange={(e) => setNewStartup({ ...newStartup, funding_goal: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />
                                {errors.funding_goal && <p className="text-red-500 text-xs">{errors.funding_goal}</p>}

                                <input
                                    type="number"
                                    placeholder="Team Size"
                                    value={newStartup.team_size}
                                    onChange={(e) => setNewStartup({ ...newStartup, team_size: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />

                                <textarea
                                    placeholder="Short Description"
                                    rows="3"
                                    value={newStartup.description}
                                    onChange={(e) => setNewStartup({ ...newStartup, description: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />

                                <input
                                    type="url"
                                    placeholder="Website / Product Link"
                                    value={newStartup.website}
                                    onChange={(e) => setNewStartup({ ...newStartup, website: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />

                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={newStartup.location}
                                    onChange={(e) => setNewStartup({ ...newStartup, location: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white"
                                />

                                {/* Existing deck link in edit mode */}
                                {editingStartup?.pitch_deck && !newStartup.pitch_deck && (
                                    <p className="text-sm text-gray-400">
                                        Current file:{" "}
                                        <a
                                            href={fileUrl(editingStartup.pitch_deck)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-purple-400 hover:underline"
                                        >
                                            View Pitch Deck
                                        </a>
                                    </p>
                                )}

                                <label className="block text-sm text-gray-300">Pitch Deck (PDF/PPT)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.ppt,.pptx"
                                    onChange={(e) => setNewStartup({ ...newStartup, pitch_deck: e.target.files[0] })}
                                    className="w-full p-2 rounded-xl bg-[#1A2236] text-white"
                                />

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button type="button" variant="secondary" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
