import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Globe,
    CheckCircle,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FounderProfilePage() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const mountedRef = useRef(true);

    // toasts
    const [toasts, setToasts] = useState([]);
    const toastTimers = useRef({});

    useEffect(() => {
        mountedRef.current = true;
        fetchProfile();
        return () => {
            mountedRef.current = false;
            // clear any toast timers
            Object.values(toastTimers.current).forEach((t) => clearTimeout(t));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addToast = (type, title, message = "") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts((t) => [...t, { id, type, title, message }]);
        const timer = setTimeout(() => {
            setToasts((t) => t.filter((x) => x.id !== id));
            delete toastTimers.current[id];
        }, 4200);
        toastTimers.current[id] = timer;
    };

    const removeToast = (id) => {
        setToasts((t) => t.filter((x) => x.id !== id));
        if (toastTimers.current[id]) {
            clearTimeout(toastTimers.current[id]);
            delete toastTimers.current[id];
        }
    };

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get("profiles/founder-profiles/me/");
            if (!mountedRef.current) return;
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to load profile", err);
            addToast("error", "Load failed", "Could not load profile — check console.");
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((p) => ({ ...(p || {}), [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
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
            addToast("success", "Saved", "Profile updated successfully.");
        } catch (err) {
            console.error("Failed to update profile", err);
            addToast("error", "Save failed", "Could not update profile — see console.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        // discard local edits by reloading from server
        setEditing(false);
        setLoading(true);
        api
            .get("profiles/founder-profiles/me/")
            .then((res) => {
                if (!mountedRef.current) return;
                setProfile(res.data);
            })
            .catch((err) => console.error("Failed to reload profile", err))
            .finally(() => {
                if (mountedRef.current) setLoading(false);
            });
    };

    if (loading) return <p className="text-center mt-10 text-gray-300">Loading profile...</p>;
    if (!profile) return <p className="text-center mt-10 text-gray-300">No profile found.</p>;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Founder Profile</h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-xl">
                            Keep your founder profile sharp — investors will scan your key info quickly.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {!editing ? (
                            <Button
                                onClick={() => setEditing(true)}
                                variant="primary"
                                size="default"
                                className="flex items-center gap-2 px-3 py-2"
                            >
                                <User size={14} /> Edit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleCancelEdit}
                                    variant="secondary"
                                    size="default"
                                    className="flex items-center gap-2 px-3 py-2"
                                >
                                    <X size={14} /> Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    variant="primary"
                                    size="default"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-3 py-2"
                                >
                                    <CheckCircle size={14} /> {saving ? "Saving..." : "Save"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Card */}
                <Card className="shadow-lg bg-gradient-to-br from-[#0B1220] to-[#07121a] border border-white/6 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        {editing ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-300 mb-2 block">Full name</label>
                                        <input
                                            name="full_name"
                                            value={profile.full_name || ""}
                                            onChange={handleChange}
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                            placeholder="Full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-300 mb-2 block">Email</label>
                                        <input
                                            name="email"
                                            value={profile.email || ""}
                                            onChange={handleChange}
                                            type="email"
                                            className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                            placeholder="Email"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
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

                                <div className="mt-3">
                                    <label className="text-xs text-gray-300 mb-2 block">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={profile.bio || ""}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Short bio"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
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

                                <div className="mt-3">
                                    <label className="text-xs text-gray-300 mb-2 block">Experience (brief)</label>
                                    <textarea
                                        name="experience"
                                        value={profile.experience || ""}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Experience"
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                </div>

                                <div className="mt-3">
                                    <label className="text-xs text-gray-300 mb-2 block">Key skills (comma separated)</label>
                                    <input
                                        name="skills"
                                        value={profile.skills || ""}
                                        onChange={handleChange}
                                        placeholder="React, Node, Growth..."
                                        className="w-full p-3 rounded-xl bg-[#0F1724] text-white border border-white/6"
                                    />
                                </div>


                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-indigo-300">
                                            <User size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs text-gray-400">Full name</div>
                                            <div className="text-base text-white font-medium leading-snug">{profile.full_name || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-blue-300">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Email</div>
                                            <div className="text-base text-white font-medium leading-snug">{profile.email || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-green-300">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Phone</div>
                                                <div className="text-base text-white font-medium">{profile.phone || "Not provided"}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-teal-300">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Location</div>
                                                <div className="text-base text-white font-medium">{profile.location || "Not provided"}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-amber-300">
                                                <Briefcase size={18} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Company / Role</div>
                                                <div className="text-base text-white font-medium">{profile.company || "Not provided"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 pt-2">
                                        <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-rose-300">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Bio</div>
                                            <div className="text-base text-white mt-1">{profile.bio || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/6 grid place-items-center text-cyan-300">
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400">Website</div>
                                                <div className="text-base text-white truncate max-w-xs">{profile.website || "—"}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-400">Experience</div>
                                            <div className="text-base text-white mt-1">{profile.experience || "Not provided"}</div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-400">Skills</div>
                                            <div className="text-base text-white mt-1">{profile.skills || "Not provided"}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* TOP-RIGHT TOASTS */}
            <div className="fixed top-6 right-6 z-60 flex flex-col gap-3 items-end px-2">
                <AnimatePresence initial={false}>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.26, ease: "easeOut" }}
                            className={`w-full max-w-xs p-3 rounded-xl shadow-2xl border flex items-start gap-3 pointer-events-auto ${t.type === "success"
                                ? "bg-gradient-to-r from-green-700/95 to-green-600/85 border-green-500/60 text-white"
                                : "bg-gradient-to-r from-red-700/95 to-red-600/85 border-red-500/60 text-white"
                                }`}
                        >
                            <div className="pt-0.5">
                                <div className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center">
                                    {t.type === "success" ? <CheckCircle size={18} /> : <X size={16} />}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <strong className="text-sm">{t.title}</strong>
                                    <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white text-xs">
                                        Close
                                    </button>
                                </div>
                                {t.message && <div className="text-xs mt-1 text-white/90">{t.message}</div>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
