"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Home, User, Mail, Cpu, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { name: t("nav.home"), icon: Home, href: "#" },
        { name: t("nav.about"), icon: User, href: "#about" },
        { name: t("nav.skills"), icon: Cpu, href: "#skills" },
        { name: t("nav.projects"), icon: Code, href: "#projects" },
        { name: t("nav.contact"), icon: Mail, href: "#contact" },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center w-full px-4 md:px-8 py-4 md:py-8 pointer-events-none"
        >
            <div className="pointer-events-auto">
                <a href="#" className="text-xl md:text-2xl font-black tracking-tighter text-gray-950 hover:opacity-70 transition-opacity">
                    L.D.Chinh<span className="text-purple-600">.</span>
                </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="glass-nav rounded-full px-8 py-4 flex items-center gap-4 md:gap-8 shadow-xl shadow-purple-500/5 backdrop-blur-xl border border-white/20">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100/50 text-gray-600">
                                <link.icon size={18} />
                            </div>
                            <span className="text-base font-semibold text-gray-600 whitespace-nowrap">
                                {link.name}
                            </span>
                        </a>
                    ))}

                    <div className="w-px h-4 bg-gray-200 mx-1"></div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
                            className="p-2 rounded-full hover:bg-gray-100/50 text-gray-600 transition-all duration-300 font-bold text-xs min-w-[34px]"
                            aria-label="Toggle Language"
                        >
                            {language.toUpperCase()}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="xl:hidden pointer-events-auto ml-auto">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-full hover:bg-gray-100/50 text-gray-600 transition-all duration-300 cursor-pointer"
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 z-50 mt-4 mx-4 glass-card rounded-2xl shadow-xl shadow-purple-500/5 backdrop-blur-xl border border-white/20 overflow-hidden xl:hidden"
                    >
                        <div className="flex flex-col py-4 pointer-events-auto">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.href === '#') {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else {
                                            const target = document.querySelector(link.href);
                                            if (target) {
                                                target.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-100/50 transition-colors cursor-pointer"
                                >
                                    <link.icon size={18} />
                                    <span className="font-semibold">{link.name}</span>
                                </a>
                            ))}
                            
                            <div className="w-full h-px bg-gray-200 my-2"></div>
                            
                            <div className="px-6 py-3">
                                <button
                                    onClick={() => {
                                        setLanguage(language === "vi" ? "en" : "vi");
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-gray-600 font-bold text-sm"
                                >
                                    {language === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
