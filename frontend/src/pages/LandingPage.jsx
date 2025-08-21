import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Handshake, LineChart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Footer from "../components/Footer";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

export default function LandingPage() {
    useEffect(() => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
    }, []);

    const steps = [
        {
            icon: Building2,
            title: "Founders Create Startups",
            description:
                "Launch multiple startups, set how much funding you want, and decide how much equity to offer.",
        },
        {
            icon: Users,
            title: "Investors Explore Profiles",
            description: "Browse founder profiles, check their startups, and decide where to invest.",
        },
        {
            icon: Handshake,
            title: "Send & Accept Funding Requests",
            description:
                "Investors send requests for specific amounts. Founders accept or decline with full control.",
        },
        {
            icon: LineChart,
            title: "Track Growth",
            description:
                "Accepted investments add to the raised amount. Everyone tracks progress in real-time.",
        },
    ];

    const features = [
        {
            title: "For Founders",
            description: "Start multiple startups, set funding goals, and control your equity offers.",
            icon: Building2,
        },
        {
            title: "For Investors",
            description:
                "Review detailed founder profiles, send funding requests, and manage your portfolio.",
            icon: Users,
        },
        {
            title: "For Both",
            description: "Secure deals, global network access, and transparent progress tracking.",
            icon: Handshake,
        },
    ];

    return (
        <div className="min-h-screen bg-[#0E1525] text-[#E4E9F2] font-sans scroll-smooth">
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 bg-[#0E1525]/70 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-[#1A2236] rounded-xl flex items-center justify-center shadow-md">
                            <Handshake className="w-5 h-5 text-[#4F91FF]" />
                        </div>
                        <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                            <a href="/">Find & Fund</a>
                        </span>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Link to="/signin">
                            <Button
                                variant="ghost"
                                className="px-3 py-1 text-sm md:px-4 md:py-2 md:text-base hover:bg-white/10 transition-all duration-200"
                            >
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button
                                variant="primary"
                                className="bg-[#4F91FF] hover:bg-[#3578e5] shadow-lg hover:shadow-[#4F91FF]/30 text-white transition-all duration-300 px-3 py-1 text-sm md:px-4 md:py-2 md:text-base rounded-xl"
                            >
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="pt-40 md:pt-44 pb-32 md:pb-40 px-4 md:px-6 relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="max-w-5xl mx-auto text-center space-y-6"
                >
                    <Badge className="mx-auto bg-[#1A2236] text-[#4F91FF]">
                        Startups • Investors • Growth
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                        Build the Future with <span className="text-[#4F91FF]">Find & Fund</span>
                    </h1>
                    <p className="text-base md:text-lg text-[#A0AEC0] max-w-2xl mx-auto">
                        Founders launch multiple startups, set goals & equity. Investors explore profiles, send requests, and fund the future.
                    </p>
                </motion.div>
            </section>

            {/* HOW IT WORKS */}
            <section className="pt-16 md:pt-32 pb-24 md:pb-32 px-4 md:px-6 bg-[#141B2D]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-base md:text-lg text-[#A0AEC0] max-w-3xl mx-auto">
                            A smooth, transparent process for founders and investors.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="rounded-xl bg-[#1A2236]/90 backdrop-blur-sm p-6 shadow-lg border border-white/5 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-[#4F91FF]/30"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 mb-5 bg-[#0E1525] rounded-xl flex items-center justify-center mx-auto shadow-inner">
                                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-[#4F91FF]" />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-[#A0AEC0] text-sm md:text-base">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>



            {/* FEATURES */}
            <section className="py-16 md:py-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Find & Fund?</h2>
                        <p className="text-base md:text-lg text-[#A0AEC0] max-w-3xl mx-auto">
                            Tailored for both founders and investors — powerful, flexible, and transparent.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeInUp}
                                className="rounded-xl bg-[#1A2236]/90 backdrop-blur-sm p-6 shadow-lg border border-white/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-[#4F91FF]/30"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 mb-5 bg-[#0E1525] rounded-xl flex items-center justify-center shadow-inner">
                                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-[#4F91FF]" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-[#A0AEC0] text-sm md:text-base">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-20 md:py-24 px-4 md:px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1A2236]/50 via-transparent to-transparent opacity-60" />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <h2 className="text-3xl md:text-5xl font-bold">Ready to Get Started?</h2>
                    <p className="text-base md:text-lg text-[#A0AEC0]">
                        Whether you're building the next unicorn or backing it — Find & Fund is where it starts.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Link to="/signup">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#4F91FF] text-[#4F91FF] px-5 md:px-6 py-2.5 md:py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#4F91FF]/30 w-full sm:w-auto"
                            >
                                Get started <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
