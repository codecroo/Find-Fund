import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DasboardLayout from "../../layouts/DashboardLayout"

export default function FounderProfilePage() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get("profiles/founder-profiles/me/");
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
            const res = await api.put(`profiles/founder-profiles/me/`, profile);
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
        <DasboardLayout>
            <div className="max-w-2xl mx-auto mt-10 space-y-6">

                <Card className="p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Founder Profile</h2>
                    <CardContent className="space-y-4">
                        {editing ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="full_name"
                                    value={profile.full_name || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Full Name"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Email"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Phone Number"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={profile.location || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Location (City, Country)"
                                />
                                <input
                                    type="text"
                                    name="company"
                                    value={profile.company || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Company / Role"
                                />
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
                                    type="url"
                                    name="twitter"
                                    value={profile.twitter || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Twitter / X URL"
                                />
                                <input
                                    type="url"
                                    name="website"
                                    value={profile.website || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Personal Website / Portfolio"
                                />
                                <textarea
                                    name="experience"
                                    value={profile.experience || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Experience"
                                />
                                <textarea
                                    name="skills"
                                    value={profile.skills || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Key Skills (comma separated)"
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
                                <p><strong>Full Name:</strong> {profile.full_name || "Not provided"}</p>
                                <p><strong>Email:</strong> {profile.email || "Not provided"}</p>
                                <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
                                <p><strong>Location:</strong> {profile.location || "Not provided"}</p>
                                <p><strong>Company:</strong> {profile.company || "Not provided"}</p>
                                <p><strong>Bio:</strong> {profile.bio || "Not provided"}</p>
                                <p><strong>LinkedIn:</strong> {profile.linkedin || "Not provided"}</p>
                                <p><strong>Twitter:</strong> {profile.twitter || "Not provided"}</p>
                                <p><strong>Website:</strong> {profile.website || "Not provided"}</p>
                                <p><strong>Experience:</strong> {profile.experience || "Not provided"}</p>
                                <p><strong>Skills:</strong> {profile.skills || "Not provided"}</p>
                                <Button onClick={() => setEditing(true)}>✏️ Edit Profile</Button>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </DasboardLayout>
    );
}