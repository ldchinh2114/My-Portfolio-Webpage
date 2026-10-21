"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MousePointerClick } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Hero = () => {
    const { t } = useLanguage();

    const stats = [
        { label: t("hero.stat.apps"), value: "3" },
        { label: t("hero.stat.stack"), value: "10+" },
        { label: t("hero.stat.focus"), value: t("hero.stat.focusValue") },
    ];

    const marquee = t("hero.marquee").repeat(2);

    return (
        <section className="relative min-h-screen flex items-center pt-32 md:pt-36 pb-20 md:pb-28 px-4 md:px-6 overflow-hidden">
            {/* Static warm glows — gradient only, no blur filters */}
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-48 -left-40 w-[560px] h-[560px] warm-glow" />
                <div className="absolute -bottom-48 -right-32 w-[520px] h-[520px] warm-glow-gold" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[300px] warm-glow-rust" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-white/70 text-sm md:text-base font-semibold tracking-wide text-ink-soft mb-8"
                    >
                        <Sparkles size={14} className="text-primary" />
                        {t("hero.badge")}
                    </motion.span>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[0.95] mb-8">
                        <span className="block gradient-text">{t("hero.title")}</span>
                        <span className="block text-ink/35">{t("hero.subtitle")}</span>
                        <span className="block accent-text glow-text">{t("hero.title2")}</span>
                    </h1>

                    <p className="text-base md:text-xl text-muted max-w-2xl leading-relaxed mb-10 text-balance">
                        {t("hero.description")}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="flex flex-col sm:flex-row gap-4 mb-14"
                    >
                        <a href="#projects" className="btn-primary px-8 py-3.5 text-sm md:text-base">
                            {t("hero.viewProjects")}
                            <ArrowRight size={18} />
                        </a>
                        <a href="#contact" className="btn-ghost px-8 py-3.5 text-sm md:text-base">
                            {t("hero.contactMe")}
                        </a>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.dl
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line max-w-2xl"
                    >
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-card px-6 py-5">
                                <dd className="text-2xl md:text-3xl font-extrabold text-ink">
                                    {stat.value}
                                </dd>
                                <dt className="mt-1.5 text-sm md:text-base font-semibold tracking-wide text-muted">
                                    {stat.label}
                                </dt>
                            </div>
                        ))}
                    </motion.dl>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.a
                href="#about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5 text-sm font-semibold tracking-wide text-muted hover:text-primary transition-colors"
            >
                {t("hero.scroll")}
                <MousePointerClick size={16} className="animate-bounce" />
            </motion.a>

            {/* Marquee */}
            <div className="absolute bottom-0 left-0 right-0 z-0 border-y border-line bg-chip/50 py-3 overflow-hidden mask-fade-x">
                <div className="flex w-max animate-marquee">
                    <span className="text-sm font-semibold tracking-[0.2em] text-ink/50 px-6 whitespace-nowrap">
                        {marquee}
                    </span>
                    <span className="text-sm font-semibold tracking-[0.2em] text-ink/50 px-6 whitespace-nowrap">
                        {marquee}
                    </span>
                </div>
            </div>
        </section>
    );
};
