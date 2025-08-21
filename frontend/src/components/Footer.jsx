import { motion } from "framer-motion"
import {
    Handshake,
    Twitter,
    Linkedin,
    Github,
    Users,
    Mail,
    Phone,
    CheckCircle,
} from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Github, href: "#", label: "GitHub" },
    ]

    return (
        <footer className="bg-slate-900 text-white text-sm border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Top: Brand + Contact */}
                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Brand + Socials */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-[#1A2236] rounded-xl flex items-center justify-center">
                                <Handshake className="w-5 h-5 text-[#4F91FF]" />
                            </div>
                            <span className="text-2xl font-bold">Find & Fund</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Connecting innovative founders with visionary investors. Building the
                            future of startup funding, one connection at a time.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <social.icon className="w-5 h-5 text-gray-300 hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Mail className="w-5 h-5 text-purple-400" />
                                <span className="font-medium">Email</span>
                            </div>
                            <div className="text-gray-400">fndf@gmail.com</div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <span className="font-medium">Phone</span>
                            </div>
                            <div className="text-gray-400">+91 8511096433</div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Users className="w-5 h-5 text-green-400" />
                                <span className="font-medium">Team</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-gray-400">
                                {["Parth", "Dharman", "Nihanshu", "Vrisha", "Bindiya"].map((n) => (
                                    <span
                                        key={n}
                                        className="px-2 py-0.5 bg-white/10 rounded-md text-sm"
                                    >
                                        {n}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-6">
                    <div className="text-gray-500 mb-4 md:mb-0">
                        © {currentYear} Find & Fund. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">System Status: </span>
                        <span className="text-green-400 font-medium">Operational</span>
                    </div>
                </div>
            </div>
        </footer>
      
    )
}
