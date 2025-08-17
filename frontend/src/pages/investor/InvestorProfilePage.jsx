import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function InvestorProfilePage() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get("/api/profiles/investor-profiles/me/");
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await api.put(`/api/profiles/investor-profiles/${profile.id}/`, profile);
            setProfile(res.data);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to update profile");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading profile...</p>;
    if (!profile) return <p className="text-center mt-10">No profile found.</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
            <Card className="p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Investor Profile</h2>
                <CardContent className="space-y-4">
                    {editing ? (
                        <div className="space-y-4">
                            <textarea
                                name="bio"
                                value={profile.bio || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Tell us about yourself"
                            />
                            <input
                                type="url"
                                name="linkedin"
                                value={profile.linkedin || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="LinkedIn URL"
                            />
                            <input
                                type="number"
                                name="investment_range_min"
                                value={profile.investment_range_min || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Min Investment"
                            />
                            <input
                                type="number"
                                name="investment_range_max"
                                value={profile.investment_range_max || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Max Investment"
                            />
                            <input
                                type="text"
                                name="industries_of_interest"
                                value={profile.industries_of_interest || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Industries of Interest"
                            />
                            <input
                                type="text"
                                name="location"
                                value={profile.location || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Location"
                            />
                            <div className="flex space-x-4">
                                <Button onClick={handleSave}>💾 Save</Button>
                                <Button variant="secondary" onClick={() => setEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
                            <p><strong>LinkedIn:</strong> {profile.linkedin || "Not provided"}</p>
                            <p>
                                <strong>Investment Range:</strong>{" "}
                                {profile.investment_range_min || "?"} - {profile.investment_range_max || "?"}
                            </p>
                            <p><strong>Industries:</strong> {profile.industries_of_interest || "Not provided"}</p>
                            <p><strong>Location:</strong> {profile.location || "Not provided"}</p>
                            <Button onClick={() => setEditing(true)}>✏️ Edit Profile</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
