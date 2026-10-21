"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Cpu, Code, Mail, Menu, X } from "lucide-react";
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

    const scrollTo = (href: string) => {
        setIsMenuOpen(false);
        if (href === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-8 py-4 md:py-6 pointer-events-none"
        >
            <div className="max-w-6xl mx-auto glass-nav rounded-2xl md:rounded-full px-4 md:px-6 py-3 flex items-center gap-4 shadow-lg shadow-[#c9b89a]/25 pointer-events-auto">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollTo("#");
                    }}
                    className="text-lg md:text-xl font-extrabold tracking-tight text-ink hover:opacity-70 transition-opacity"
                >
                    L.D.Chinh<span className="accent-text">.</span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1 ml-auto">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo(link.href);
                            }}
                            className="group relative px-4 py-2 flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
                        >
                            <link.icon size={16} className="opacity-70 group-hover:opacity-100" />
                            {link.name}
                            <span className="absolute left-4 right-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        </a>
                    ))}
                </div>

                <button
                    onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
                    className="ml-auto lg:ml-3 text-xs font-bold tracking-wide px-3.5 py-2 rounded-full border border-line bg-chip text-ink-soft hover:border-primary/60 hover:text-primary transition-colors"
                    aria-label="Toggle Language"
                >
                    {language === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}
                </button>

                {/* Mobile/Tablet Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 rounded-xl text-ink-soft hover:bg-chip transition-colors cursor-pointer"
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden max-w-6xl mx-auto mt-2 glass-card rounded-2xl shadow-lg shadow-[#c9b89a]/30 overflow-hidden"
                    >
                        <div className="flex flex-col py-2">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollTo(link.href);
                                    }}
                                    className="flex items-center gap-3 px-5 py-3 text-ink-soft hover:text-primary hover:bg-chip/60 transition-colors"
                                >
                                    <link.icon size={18} />
                                    <span className="font-semibold">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
