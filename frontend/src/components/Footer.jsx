import { motion } from "framer-motion"
import { Handshake, Twitter, Linkedin, Github, Users, Mail, Phone, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Github, href: "#", label: "GitHub" },
    ]

    return (
        <footer className="bg-gradient-to-t from-slate-900 to-slate-800 border-t border-white/10 text-white text-sm">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {/* Brand Section with Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500/50 rounded-lg flex items-center justify-center">
                                <Handshake className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">Find & Fund</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm mb-4">
                            Connecting innovative founders with visionary investors. Building the future of startup funding, one connection at a time.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 text-gray-300 hover:text-white" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="md:col-span-1 lg:col-span-2 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4"
                    >
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                            {/* Email */}
                            <div className="m-auto bg-white/5 rounded-xl p-4  border border-white/10 backdrop-blur-md">
                                <div className="flex items-start space-x-3">
                                    <div className="w-9 h-9 bg-purple-500/20 rounded-md flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white font-medium">Email</div>
                                        <div className="text-gray-400 break-words text-sm">parthdelvadiya@gmail.com</div>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="m-auto bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-md">
                                <div className="flex items-start space-x-3">
                                    <div className="w-9 h-9 bg-blue-500/20 rounded-md flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white font-medium">Phone</div>
                                        <div className="text-gray-400 break-words text-sm">+91 8511096433</div>
                                    </div>
                                </div>
                            </div>

                            {/* Team */}
                            <div className="m-auto bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-md">
                                <div className="flex items-start space-x-3">
                                    <div className="w-9 h-9 bg-green-500/20 rounded-md flex items-center justify-center">
                                        <Users className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white font-medium">Team</div>
                                        <div className="text-gray-400 break-words text-sm">Parth – One man army</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Bottom Line */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10"
                >
                    <div className="text-gray-500 mb-4 md:mb-0">
                        © {currentYear} Find & Fund. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">System Status: </span>
                        <span className="text-green-400 font-medium">Operational</span>
                    </div>
                </motion.div>
            </div>
        </footer>

    )
}
