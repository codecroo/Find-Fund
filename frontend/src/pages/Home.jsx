import { useState } from "react";
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
        text: "We were pitching cold on LinkedIn for months. Within 3 weeks, we had warm intros, real investor calls, and closed $150k",
    },
    {
        name: "Arjun Mehta",
        role: "Angel Investor",
        text: "Every startup I reviewed was legit — clean metrics, thoughtful vision, and founder-ready.",
    },
    {
        name: "Sara Jordan",
        role: "Founder @ Taskloop",
        text: "This is the first place where I felt seen. Investors reached out to us — no chasing, no ghosting.",
    },
];

export default function Home() {
    const [index, setIndex] = useState(0);

    const features = [
        { icon: SearchCheck, title: "Smarter Deal Discovery", description: "Get matched with startups that fit your thesis.", badge: "Investor" },
        { icon: Globe2, title: "Global Reach", description: "Share your story across borders — no limits on discovery.", badge: "Founder" },
        { icon: Radar, title: "Discover Hidden Talent", description: "Access global founders outside your usual network.", badge: "Investor" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-t from-slate-900 to-indigo-900/50  text-white relative overflow-hidden font-sans">

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md">
                <div className="max-w-7xl bg-indigo-900/50 mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#1c1854] rounded-xl flex items-center justify-center shadow-md">
                            <Handshake className="w-5 h-5 text-[#ffffff]" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            <a href="/">Find & Fund</a>
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/"><Button variant="ghost" size="md">Login</Button></Link>
                        <Link to="/"><Button variant="primary" size="md" >Get Started</Button></Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="pt-36 pb-24 px-6 relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="max-w-4xl mx-auto text-center space-y-6"
                >
                    <Badge className="mx-auto">Find Talent - Fund Potential</Badge>
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                        Where Ideas Meet <span className="text-[#19154f]">Capital</span>
                    </h1>
                    <p className="text-lg text-[#e5e5e5]">
                        Connect innovative founders with visionary investors. Our platform matches you with the perfect partners to build the future together.
                    </p>
                    <Link to="/">
                        <Button size="lg" variant="primary" className="mt-6 flex items-center justify-center gap-2">
                            Start Your Journey <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* FEATURES */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Find & Fund?</h2>
                        <p className="text-xl text-[#060609] max-w-3xl mx-auto">
                            Our platform combines cutting-edge technology with human expertise to create meaningful connections in the startup ecosystem.
                        </p>
                    </motion.div>

                    <div className="grid gap-10 md:grid-cols-3">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="rounded-xl bg-gradient-to-br from-[#1c1854]/70 to-[#080742]/70 p-6 shadow-lg hover:scale-[1.03] transition-transform duration-200"
                            >
                                <Badge className="mb-4 px-2 py-1  text-[#080742]">{feature.badge}</Badge>
                                <div className="w-14 h-14 mb-5 bg-[#ffffff54] rounded-xl flex items-center justify-center shadow-md">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-[#dcd2c1] text-sm leading-relaxed">{feature.description}</p>
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
                        <p className="text-lg text-[#dcd2c1]">Hear from founders and investors who found their perfect match</p>
                    </motion.div>

                    <div className="relative bg-gradient-to-br from-[#1c1854]/70 to-[#080742]/70 rounded-xl p-10 shadow-lg text-center">
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
                                        <Star key={i} className="w-5 h-5 text-[#1c1854] fill-[#ffffff]" />
                                    ))}
                                </div>
                                <p className="italic text-lg leading-relaxed max-w-3xl mx-auto text-[#e5e5e5]">
                                    “{testimonials[index].text}”
                                </p>
                                <div className="flex flex-col items-center space-y-1 mt-4">
                                    <div className="w-12 h-12 bg-[#ffffff] rounded-full flex items-center justify-center shadow-md">
                                        <UserCircle className="w-5 h-5 text-[#080742]" />
                                    </div>
                                    <div className="font-semibold">{testimonials[index].name}</div>
                                    <div className="text-sm text-[#ffffff]">{testimonials[index].role}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all duration-150 cursor-pointer ${i === index ? "bg-[#000000] scale-110" : "bg-[#424242] hover:bg-[#d9b382]/70"}`}
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
