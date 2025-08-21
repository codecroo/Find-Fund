import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DashboardLayout from "../../layouts/DashboardLayout";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";

export default function FounderProfilePage() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        async function fetchProfile() {
            try {
                const res = await api.get("profiles/founder-profiles/me/");
                if (!mountedRef.current) return;
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                if (mountedRef.current) setLoading(false);
            }
        }
        fetchProfile();
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((p) => ({ ...p, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // send only the fields we care about
            const payload = {
                full_name: profile?.full_name ?? "",
                email: profile?.email ?? "",
                phone: profile?.phone ?? "",
                location: profile?.location ?? "",
                company: profile?.company ?? "",
                bio: profile?.bio ?? "",
                linkedin: profile?.linkedin ?? "",
                twitter: profile?.twitter ?? "",
                website: profile?.website ?? "",
                experience: profile?.experience ?? "",
                skills: profile?.skills ?? "",
            };

            const res = await api.put("profiles/founder-profiles/me/", payload);
            setProfile(res.data);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        // reload the profile to discard local edits
        setLoading(true);
        api
            .get("profiles/founder-profiles/me/")
            .then((res) => setProfile(res.data))
            .catch((err) => console.error("Failed to reload profile", err))
            .finally(() => setLoading(false));
    };

    if (loading) return <p className="text-center mt-10">Loading profile...</p>;
    if (!profile) return <p className="text-center mt-10">No profile found.</p>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Founder Profile</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Keep your profile up-to-date so investors and partners can find the right info quickly.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!editing ? (
                            <Button onClick={() => setEditing(true)} variant="primary" className="flex items-center gap-2">
                                <User size={16} /> Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleSave} disabled={saving} variant="primary" className="flex items-center gap-2">
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                                <Button onClick={handleCancelEdit} variant="secondary">
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Card */}
                <Card className="p-6 bg-gradient-to-br from-[#0B1220] to-[#071026] border border-white/6 rounded-2xl shadow-xl">
                    <CardContent>
                        {editing ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        name="full_name"
                                        value={profile.full_name || ""}
                                        onChange={handleChange}
                                        placeholder="Full name"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                    <input
                                        name="email"
                                        value={profile.email || ""}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        type="email"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <input
                                        name="phone"
                                        value={profile.phone || ""}
                                        onChange={handleChange}
                                        placeholder="Phone"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                    <input
                                        name="location"
                                        value={profile.location || ""}
                                        onChange={handleChange}
                                        placeholder="Location (City, Country)"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                    <input
                                        name="company"
                                        value={profile.company || ""}
                                        onChange={handleChange}
                                        placeholder="Company / Role"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                </div>

                                <textarea
                                    name="bio"
                                    value={profile.bio || ""}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Short bio"
                                    className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <input
                                        name="linkedin"
                                        value={profile.linkedin || ""}
                                        onChange={handleChange}
                                        placeholder="LinkedIn URL"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                    <input
                                        name="twitter"
                                        value={profile.twitter || ""}
                                        onChange={handleChange}
                                        placeholder="Twitter / X URL"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                    <input
                                        name="website"
                                        value={profile.website || ""}
                                        onChange={handleChange}
                                        placeholder="Website / Portfolio"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                </div>

                                <textarea
                                    name="experience"
                                    value={profile.experience || ""}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Experience (brief)"
                                    className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                />

                                <input
                                    name="skills"
                                    value={profile.skills || ""}
                                    onChange={handleChange}
                                    placeholder="Key skills (comma separated)"
                                    className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                />

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button onClick={handleSave} variant="primary" size="lg" disabled={saving}>
                                        {saving ? "Saving..." : "Save profile"}
                                    </Button>
                                    <Button onClick={handleCancelEdit} variant="secondary">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Full name</div>
                                            <div className="text-white font-medium">{profile.full_name || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Email</div>
                                            <div className="text-white font-medium">{profile.email || "Not provided"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Phone</div>
                                            <div className="text-white font-medium">{profile.phone || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Location</div>
                                            <div className="text-white font-medium">{profile.location || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Briefcase size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Company / Role</div>
                                            <div className="text-white font-medium">{profile.company || "Not provided"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400">Bio</div>
                                    <div className="text-white mt-1">{profile.bio || "Not provided"}</div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">LinkedIn</div>
                                        <div className="text-white truncate max-w-xs">{profile.linkedin || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Twitter</div>
                                        <div className="text-white truncate max-w-xs">{profile.twitter || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Website</div>
                                        <div className="text-white truncate max-w-xs">{profile.website || "—"}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400">Experience</div>
                                    <div className="text-white mt-1">{profile.experience || "Not provided"}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400">Skills</div>
                                    <div className="text-white mt-1">{profile.skills || "Not provided"}</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
