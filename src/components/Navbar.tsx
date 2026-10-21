"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Cpu, Code, Mail, Menu, X, NotebookPen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pendingHash = useRef<string | null>(null);
    const isHome = pathname === "/";
    const isNotesPage = pathname?.startsWith("/notes") ?? false;

    // Coming from /notes, the home sections mount after the route change, so
    // scroll once that commit has happened instead of relying on Next's hash
    // scroll (which can land at the top before the sections exist).
    useEffect(() => {
        if (pathname !== "/" || !pendingHash.current) return;

        const hash = pendingHash.current;
        pendingHash.current = null;
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, [pathname]);

    const links = [
        { name: t("nav.home"), icon: Home, href: "/" },
        { name: t("nav.about"), icon: User, href: "/#about" },
        { name: t("nav.skills"), icon: Cpu, href: "/#skills" },
        { name: t("nav.projects"), icon: Code, href: "/#projects" },
        { name: t("nav.notes"), icon: NotebookPen, href: "/notes" },
        { name: t("nav.contact"), icon: Mail, href: "/#contact" },
    ];

    // Section links smooth-scroll while on the home page; from /notes they
    // navigate back to the home page and scroll after that navigation commits.
    const handleNavClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        setIsMenuOpen(false);

        if (href === "/") {
            if (!isHome) return;
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const hash = href.startsWith("/#") ? href.slice(1) : null;
        if (!hash) return;

        if (isHome) {
            const target = document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            return;
        }

        event.preventDefault();
        pendingHash.current = hash;
        router.push(href);
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-8 py-4 md:py-6 pointer-events-none"
        >
            <div className="max-w-6xl mx-auto glass-nav rounded-2xl md:rounded-full px-4 md:px-6 py-3 flex items-center gap-4 shadow-lg shadow-[#c9b89a]/25 pointer-events-auto">
                <Link
                    href="/"
                    onClick={(e) => handleNavClick(e, "/")}
                    className="text-lg md:text-xl font-extrabold tracking-tight text-ink hover:opacity-70 transition-opacity"
                >
                    L.D.Chinh<span className="accent-text">.</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1 ml-auto">
                    {links.map((link) => {
                        const isActive = link.href === "/notes" && isNotesPage;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                aria-current={isActive ? "page" : undefined}
                                className={`group relative px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? "text-primary"
                                        : "text-ink-soft hover:text-primary"
                                }`}
                            >
                                <link.icon
                                    size={16}
                                    className="opacity-70 group-hover:opacity-100"
                                />
                                {link.name}
                                <span
                                    className={`absolute left-4 right-4 -bottom-0.5 h-px transition-transform duration-300 bg-gradient-to-r from-transparent via-primary to-transparent ${
                                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                    }`}
                                />
                            </Link>
                        );
                    })}
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
                        className="lg:hidden max-w-6xl mx-auto mt-2 glass-card rounded-2xl shadow-lg shadow-[#c9b89a]/30 overflow-hidden pointer-events-auto"
                    >
                        <div className="flex flex-col py-2">
                            {links.map((link) => {
                                const isActive = link.href === "/notes" && isNotesPage;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-chip/60 ${
                                            isActive
                                                ? "text-primary"
                                                : "text-ink-soft hover:text-primary"
                                        }`}
                                    >
                                        <link.icon size={18} />
                                        <span className="font-semibold">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
