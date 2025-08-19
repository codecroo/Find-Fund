import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, UserCircle, SearchCheck, Globe2, Radar, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Footer from "../components/Footer";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const testimonials = [
    {
        name: "Emily Patel",
        role: "Founder @ GreenTech Solutions",
        text: "Within 3 weeks, we had warm intros, real investor calls, and closed $150k.",
    },
    {
        name: "Arjun Mehta",
        role: "Angel Investor",
        text: "Every startup I reviewed was legit — clean metrics, thoughtful vision, and founder-ready.",
    },
    {
        name: "Sara Jordan",
        role: "Founder @ Taskloop",
        text: "Investors reached out to us — no chasing, no ghosting.",
    },
];

export default function LandingPage() {
    const [index, setIndex] = useState(0);

    const features = [
        { icon: SearchCheck, title: "Smarter Deal Discovery", description: "Get matched with startups that fit your thesis.", badge: "Investor" },
        { icon: Globe2, title: "Global Reach", description: "Expand your reach beyond borders and find the right partners.", badge: "Founder" },
        { icon: Radar, title: "Discover Hidden Talent", description: "Access founders outside your usual network.", badge: "Investor" },
    ];

    useEffect(() => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
    })

    return (

        <div className="min-h-screen bg-[#0E1525] text-[#E4E9F2] font-sans">
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 bg-[#0E1525]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#1A2236] rounded-xl flex items-center justify-center">
                            <Handshake className="w-5 h-5 text-[#4F91FF]" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            <a href="/">Find & Fund</a>
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link to="/signin">
                            <Button variant="ghost" size="md">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button
                                variant="primary"
                                size="md"
                                className="bg-gradient-to-r from-[#4F91FF] to-[#38B2AC] text-white"
                            >
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="pt-36 pb-24 px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="max-w-4xl mx-auto text-center space-y-6"
                >
                    <Badge className="mx-auto bg-[#1A2236] text-[#4F91FF]">Find Talent • Fund Potential</Badge>
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                        Where Ideas Meet <span className="text-[#4F91FF]">Capital</span>
                    </h1>
                    <p className="text-lg text-[#A0AEC0]">
                        Connecting innovative founders with visionary investors. The perfect match to build the future — together.
                    </p>
                    <Link to="/signup">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-[#4F91FF] to-[#38B2AC] text-white px-6 py-3"
                        >
                            Start Your Journey <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* FEATURES */}
            <section className="py-20 px-6 bg-[#141B2D]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Find & Fund?</h2>
                        <p className="text-lg text-[#A0AEC0] max-w-3xl mx-auto">
                            A platform built for meaningful, high-value connections in the startup ecosystem.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="rounded-xl bg-[#1A2236] p-6 shadow-lg border border-white/5"
                            >
                                <Badge className="mb-4 px-2 py-1 bg-[#0E1525] text-[#38B2AC]">{feature.badge}</Badge>
                                <div className="w-14 h-14 mb-5 bg-[#0E1525] rounded-xl flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-[#4F91FF]" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-[#A0AEC0] text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-10"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
                        <p className="text-lg text-[#A0AEC0]">Real stories from our growing network</p>
                    </motion.div>

                    <div className="relative bg-[#1A2236] rounded-xl p-10 shadow-lg border border-white/5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-[#4F91FF] fill-[#4F91FF]" />
                                    ))}
                                </div>
                                <p className="italic text-lg leading-relaxed max-w-3xl mx-auto text-[#E4E9F2]">
                                    “{testimonials[index].text}”
                                </p>
                                <div className="flex flex-col items-center space-y-1 mt-4">
                                    <div className="w-12 h-12 bg-[#0E1525] rounded-full flex items-center justify-center">
                                        <UserCircle className="w-5 h-5 text-[#4F91FF]" />
                                    </div>
                                    <div className="font-semibold">{testimonials[index].name}</div>
                                    <div className="text-sm text-[#A0AEC0]">{testimonials[index].role}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all duration-150 ${i === index ? "bg-[#4F91FF]" : "bg-[#374151]"}`}
                                    onClick={() => setIndex(i)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
