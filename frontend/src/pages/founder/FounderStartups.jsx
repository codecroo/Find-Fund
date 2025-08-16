import { useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/ui/Button";
import api from "../../utils/api"; // ✅ axios instance

export default function FounderStartups() {
    const [startups, setStartups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [newStartup, setNewStartup] = useState(getEmptyStartup());

    function getEmptyStartup() {
        return {
            name: "",
            industry: "",
            stage: "",
            fundingGoal: "",
            description: "",
            website: "",
            teamSize: "",
            location: "",
            pitchDeck: null,
        };
    }

    // stage descriptions
    const stageDescriptions = {
        Idea: "Concept stage where the startup is just an idea.",
        Prototype: "Basic version of the product for testing and validation.",
        MVP: "Minimum Viable Product ready to solve core problems.",
        Seed: "Early funding stage to grow product and team.",
        "Series A": "Scaling stage with product-market fit and growth.",
        "Series B": "Expansion stage focusing on scaling operations.",
    };

    // ✅ Load startups from backend
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
        if (newStartup.fundingGoal && Number(newStartup.fundingGoal) <= 0) {
            newErrors.fundingGoal = "Funding Goal must be positive";
        }
        if (newStartup.teamSize && Number(newStartup.teamSize) <= 0) {
            newErrors.teamSize = "Team Size must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // ✅ Build FormData for file upload
            const formData = new FormData();
            Object.keys(newStartup).forEach((key) => {
                if (newStartup[key]) formData.append(key, newStartup[key]);
            });

            const res = await api.post("startups/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setStartups((prev) => [...prev, res.data]); // add newly created
            handleClose();
        } catch (err) {
            console.error("Failed to save startup", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setNewStartup(getEmptyStartup());
        setErrors({});
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">My Startups</h1>
                    <Button
                        className="gap-2"
                        variant="primary"
                        onClick={() => setShowForm(true)}
                    >
                        <PlusCircle size={20} />
                        Add Startup
                    </Button>
                </div>

                {/* Empty State */}
                {startups.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <p className="text-gray-400 text-lg">No startups added yet 🚀</p>
                        <p className="mt-2 text-gray-500">
                            Click{" "}
                            <span
                                onClick={() => setShowForm(true)}
                                className="text-indigo-400 hover:underline cursor-pointer"
                            >
                                “Add Startup”
                            </span>{" "}
                            to create your first one.
                        </p>
                    </div>
                )}

                {/* Startup List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {startups.map((startup) => (
                        <div
                            key={startup.id}
                            className="bg-[#1A1F33] rounded-2xl p-6 shadow-sm border border-white/10 hover:shadow-md transition"
                        >
                            <h2 className="text-lg font-semibold text-white mb-1">
                                {startup.name}
                            </h2>
                            <p className="text-gray-400 text-sm">{startup.industry}</p>
                            <div className="mt-2">
                                <p className="text-sm text-indigo-400 font-medium">
                                    Stage: {startup.stage}
                                </p>
                                {startup.stage && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {stageDescriptions[startup.stage]}
                                    </p>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-gray-300 line-clamp-3">
                                {startup.description}
                            </p>
                            {startup.fundingGoal && (
                                <p className="mt-3 text-sm text-teal-400 font-semibold">
                                    Funding Goal: ₹{startup.fundingGoal}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Startup Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#121826] p-6 rounded-2xl w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-bold text-white mb-5">
                                Add Startup
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Startup Name"
                                            value={newStartup.name}
                                            onChange={(e) =>
                                                setNewStartup({ ...newStartup, name: e.target.value })
                                            }
                                            className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Industry"
                                        value={newStartup.industry}
                                        onChange={(e) =>
                                            setNewStartup({ ...newStartup, industry: e.target.value })
                                        }
                                        className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <select
                                        value={newStartup.stage}
                                        onChange={(e) =>
                                            setNewStartup({ ...newStartup, stage: e.target.value })
                                        }
                                        className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="Idea">Idea</option>
                                        <option value="Prototype">Prototype</option>
                                        <option value="MVP">MVP</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                        <option value="Series B">Series B</option>
                                    </select>
                                    {errors.stage && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stage}</p>
                                    )}
                                </div>

                                {newStartup.stage && (
                                    <p className="text-xs text-green-500 mt-1">
                                        {stageDescriptions[newStartup.stage]}
                                    </p>
                                )}

                                {/* Funding Goal */}
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Funding Goal (INR)"
                                        value={newStartup.fundingGoal}
                                        onChange={(e) =>
                                            setNewStartup({
                                                ...newStartup,
                                                fundingGoal: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.fundingGoal && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.fundingGoal}
                                        </p>
                                    )}
                                </div>

                                {/* Team Size */}
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Team Size"
                                        value={newStartup.teamSize}
                                        onChange={(e) =>
                                            setNewStartup({
                                                ...newStartup,
                                                teamSize: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.teamSize && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.teamSize}
                                        </p>
                                    )}
                                </div>

                                <textarea
                                    placeholder="Short Description"
                                    rows="3"
                                    value={newStartup.description}
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, description: e.target.value })
                                    }
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="url"
                                        placeholder="Website / Product Link"
                                        value={newStartup.website}
                                        onChange={(e) =>
                                            setNewStartup({ ...newStartup, website: e.target.value })
                                        }
                                        className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={newStartup.location}
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, location: e.target.value })
                                    }
                                    className="w-full p-3 rounded-xl bg-[#1A2236] text-white focus:ring-2 focus:ring-indigo-500"
                                />

                                {/* Pitch Deck */}
                                <label className="block text-sm text-gray-300 mb-2">
                                    Pitch Deck (PDF, PPT, PPTX)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.ppt,.pptx"
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, pitchDeck: e.target.files[0] })
                                    }
                                    className="w-full p-2 rounded-xl bg-[#1A2236] text-white"
                                />

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleClose}
                                    >
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