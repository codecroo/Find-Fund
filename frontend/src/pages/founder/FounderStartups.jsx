import { useState } from "react";
import { PlusCircle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Button from "../../components/ui/Button";

export default function FounderStartups() {
    const [startups, setStartups] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newStartup, setNewStartup] = useState({
        name: "",
        industry: "",
        fundingGoal: "",
        pitchDeck: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStartups([...startups, { ...newStartup, id: Date.now() }]);
        setNewStartup({ name: "", industry: "", fundingGoal: "", pitchDeck: null });
        setShowForm(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">My Startups</h1>
                    <Button
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
                            className="bg-gray-800 rounded-xl p-5 shadow hover:shadow-xl transition"
                        >
                            <h2 className="text-lg font-semibold text-white">
                                {startup.name}
                            </h2>
                            <p className="text-gray-400 text-sm">{startup.industry}</p>
                            <p className="mt-3 text-indigo-400 font-medium">
                                Funding Goal: ${startup.fundingGoal}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Add Startup Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
                            <h2 className="text-xl font-bold text-white mb-4">Add Startup</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Startup Name"
                                    value={newStartup.name}
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, name: e.target.value })
                                    }
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Industry"
                                    value={newStartup.industry}
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, industry: e.target.value })
                                    }
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Funding Goal (USD)"
                                    value={newStartup.fundingGoal}
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, fundingGoal: e.target.value })
                                    }
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        setNewStartup({ ...newStartup, pitchDeck: e.target.files[0] })
                                    }
                                    className="w-full p-2 rounded-lg bg-gray-800 text-white"
                                />
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                    >
                                        Save
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
