import { useNavigate } from "react-router-dom";

export default function Sidebar({ role, onLogout }) {
    const navigate = useNavigate();

    return (
        <aside className="w-64 bg-gray-800 p-6 space-y-6">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <nav className="space-y-4">
                <button
                    onClick={() => navigate(`/dashboard/${role.toLowerCase()}`)}
                    className="block w-full text-left hover:text-indigo-400"
                >
                    Home
                </button>

                {role === "Founder" && (
                    <>
                        <button className="block w-full text-left hover:text-indigo-400">
                            My Startups
                        </button>
                        <button className="block w-full text-left hover:text-indigo-400">
                            Funding Requests
                        </button>
                    </>
                )}

                {role === "Investor" && (
                    <>
                        <button className="block w-full text-left hover:text-indigo-400">
                            Browse Startups
                        </button>
                        <button className="block w-full text-left hover:text-indigo-400">
                            My Investments
                        </button>
                    </>
                )}

                <button
                    onClick={onLogout}
                    className="block w-full text-left text-red-400 hover:text-red-500"
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
}
