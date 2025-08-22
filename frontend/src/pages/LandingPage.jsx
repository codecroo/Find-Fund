import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Handshake,
    LineChart,
    Users,
    Menu,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Footer from "../components/Footer";

// Updated: full-page sections, larger type, better alignment and responsive tweaks
export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Clear any leaked auth state on landing for this demo
        try {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
        } catch (e) {
            // noop
        }
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const stagger = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
    };

    const steps = [
        {
            icon: Building2,
            title: "Founders Create Startups",
            description:
                "Launch multiple startups, set funding goals and equity — present a clean pitch and milestones.",
        },
        {
            icon: Users,
            title: "Investors Explore Profiles",
            description: "Browse detailed profiles, validate traction and team fit before investing.",
        },
        {
            icon: Handshake,
            title: "Send & Accept Funding Requests",
            description: "Investors request tailored amounts; founders accept with transparent terms.",
        },
        {
            icon: LineChart,
            title: "Track Growth",
            description: "Real-time updates on funding progress, milestones and equity changes.",
        },
    ];

    const features = [
        {
            title: "For Founders",
            description: "Create startups, publish pitch decks, and control equity & milestones.",
            icon: Building2,
        },
        {
            title: "For Investors",
            description: "Curate a portfolio, build watchlists, and send secure funding requests.",
            icon: Users,
        },
        {
            title: "For Both",
            description: "Transparent deals, secure escrow flow, and global network access.",
            icon: Handshake,
        },
    ];

    return (
        // Add vertical scroll snapping so each major <section> behaves like "one page"
        <div className="min-h-screen bg-gradient-to-b from-[#071021] via-[#0E1525] to-[#081423] text-[#E6EEF8] font-sans antialiased overflow-y-auto snap-y snap-mandatory">
            {/* NAV */}
            <nav className="fixed inset-x-0 top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-md bg-white/3 border border-white/6 rounded-2xl mt-4 py-3 px-4 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-[#3B82F6] to-[#7C3AED] rounded-lg flex items-center justify-center shadow-md">
                                <Handshake className="w-5 h-5 text-white" />
                            </div>
                            <Link to="/" className="text-lg md:text-xl font-bold tracking-tight hover:opacity-90">
                                Find & Fund
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-3">


                            <Link to="/signin">
                                <Button variant="ghost" className="px-4 py-2 text-sm md:text-base">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button
                                    variant="primary"
                                >
                                    Sign up
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                aria-label="Toggle menu"
                                onClick={() => setMenuOpen((s) => !s)}
                                className="p-2 rounded-lg bg-white/4 backdrop-blur-sm"
                            >
                                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile panel */}
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="md:hidden mt-3 bg-black/50 border backdrop-blur-lg border-white/6 rounded-2xl p-4 shadow-lg"
                        >
                            <div className="flex flex-col gap-3 text-lg">
                                <div className="flex gap-2">
                                    <Link to="/signin" onClick={() => setMenuOpen(false)} className="flex-1">
                                        <Button variant="ghost" className="w-45">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1">
                                        <Button variant="primary" className="w-45">
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </nav>

            {/* HERO - full viewport */}
            <header className="snap-start min-h-screen flex items-center pt-28 pb-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                    >
                        <motion.div variants={fadeInUp} className="lg:col-span-7 flex flex-col justify-center">
                            <Badge className="w-50" >Startups • Investors • Growth</Badge>

                            <h1 className="py-6">
                                Build the future with <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#4F91FF]">Find & Fund</span>
                            </h1>

                            <p className=" text-lg md:text-xl text-[#B6C6DD] max-w-3xl">
                                A modern marketplace that connects founders and investors — transparent terms, secure funding flows, and real-time growth tracking.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <Link to="/signup">
                                    <Button size="lg" className="shadow-lg px-6 py-4 text-base md:text-lg rounded-xl">
                                        Get started <ArrowRight className="ml-3 w-5 h-5 inline-block" />
                                    </Button>
                                </Link>
                                <a href="#how" className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/6 hover:bg-white/8 transition text-base md:text-lg">
                                    Learn how it works
                                </a>
                            </div>


                        </motion.div>

                        <motion.div variants={fadeInUp} className="lg:col-span-5 relative">
                            {/* Decorative card / mockup (kept responsive and centered) */}
                            <div className="relative mx-auto w-full max-w-md">
                                <div className="transform -rotate-3 rounded-2xl bg-gradient-to-tr from-[#0F1724] to-[#0B1220] p-1 shadow-2xl">
                                    <div className="rounded-2xl bg-[#07101A] p-6 border border-white/6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-sm md:text-base text-[#9FB4DB]">StartUp</div>
                                                <div className="text-lg md:text-xl font-semibold">Acme Labs</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm md:text-base text-[#9FB4DB]">Raised</div>
                                                <div className="text-lg md:text-xl font-semibold">120k</div>
                                            </div>
                                        </div>

                                        <div className="h-36 md:h-44 rounded-lg bg-gradient-to-r from-white/6 to-white/3 flex items-end p-3">
                                            <div className="w-full">
                                                <div className="h-2 md:h-3 bg-white/20 rounded-full mb-2 w-4/5"></div>
                                                <div className="h-2 md:h-3 bg-white/12 rounded-full w-2/5"></div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-sm md:text-base text-[#9FB4DB]">
                                            <div>Equity: 8%</div>
                                            <div>Remaining: 80k</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* subtle decorative SVG - responsive sizing */}
                <svg className="absolute right-0 top-40 opacity-10 w-64 md:w-80 -z-10" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                            <stop offset="0%" stopColor="#4F91FF" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <circle cx="200" cy="200" r="180" fill="url(#g1)" />
                </svg>
            </header>

            {/* HOW IT WORKS - full viewport */}
            <section id="how" className="snap-start min-h-screen flex items-center py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">How it works</h2>
                        <p className="mt-3 text-lg md:text-xl text-[#B6C6DD] max-w-2xl mx-auto">A smooth, secure process for founders and investors — designed for clarity and speed.</p>
                    </motion.div>

                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, i) => (
                            <motion.div key={i} variants={fadeInUp} className="rounded-2xl p-6 bg-white/3 border border-white/6 shadow transition hover:scale-[1.03]">
                                <div className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#4F91FF]/20 to-[#7C3AED]/20">
                                    <step.icon className="w-6 h-6 text-[#DFF0FF]" />
                                </div>
                                <h3 className="font-semibold text-lg md:text-xl">{step.title}</h3>
                                <p className="mt-2 text-sm md:text-base text-[#B6C6DD]">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FEATURES - full viewport */}
            <section className="snap-start min-h-screen flex items-center py-12 bg-gradient-to-b from-transparent to-[#04101B]">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Why choose Find & Fund</h2>
                        <p className="mt-3 text-lg md:text-xl text-[#B6C6DD] max-w-2xl mx-auto">Designed for both founders and investors — powerful, flexible and transparent.</p>
                    </motion.div>

                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="rounded-2xl p-6 bg-white/3 border border-white/6 shadow hover:shadow-lg transition">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-[#7C3AED]/20 to-[#4F91FF]/20">
                                    <f.icon className="w-6 h-6 text-[#E9F4FF]" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold">{f.title}</h3>
                                <p className="mt-2 text-sm md:text-base text-[#B6C6DD]">{f.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="snap-start min-h-screen flex items-center py-20 px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center w-full">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Ready to back or build the next great company?</h2>
                        <p className="mt-4 text-lg md:text-xl text-[#B6C6DD]">Join a community where transparency, security and growth meet.</p>

                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" >Get started</Button>
                            </Link>

                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
