"use client";
import React from "react";
import { motion } from "framer-motion";
import { Globe, Smartphone, Monitor, Gamepad2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const About = () => {
    const { t } = useLanguage();

    const platforms = [
        {
            key: "web",
            icon: Globe,
            title: t("about.p.web.title"),
            desc: t("about.p.web.desc"),
            tint: "bg-[#c2571f]/10",
            iconColor: "text-primary",
        },
        {
            key: "mobile",
            icon: Smartphone,
            title: t("about.p.mobile.title"),
            desc: t("about.p.mobile.desc"),
            tint: "bg-[#b08236]/12",
            iconColor: "text-secondary",
        },
        {
            key: "desktop",
            icon: Monitor,
            title: t("about.p.desktop.title"),
            desc: t("about.p.desktop.desc"),
            tint: "bg-[#a8452c]/10",
            iconColor: "text-accent",
        },
        {
            key: "game",
            icon: Gamepad2,
            title: t("about.p.game.title"),
            desc: t("about.p.game.desc"),
            tint: "bg-[#8a6d2f]/12",
            iconColor: "text-[#8a6d2f]",
            badge: t("about.p.game.badge"),
        },
    ];

    const stats = [
        { label: t("about.stats.ai"), value: "5+" },
        { label: t("about.stats.stack"), value: "8" },
        { label: t("about.stats.apps"), value: "3" },
        { label: t("about.stats.games"), value: "1" },
    ];

    return (
        <section id="about" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[760px] h-[320px] warm-glow" />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Heading + description */}
                <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center gap-2 text-sm md:text-base font-bold tracking-wide text-primary mb-5">
                            <Sparkles size={15} />
                            {t("about.eyebrow")}
                        </span>

                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-[1.05] mb-6">
                            {t("about.title")}{" "}
                            <span className="text-ink/35">{t("about.developer")}</span>
                        </h2>

                        <p className="text-base md:text-lg text-muted leading-relaxed text-balance">
                            {t("about.description")}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    className="rounded-2xl border border-line bg-card px-4 py-5 text-center"
                                >
                                    <p className="text-2xl md:text-3xl font-extrabold accent-text">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1.5 text-sm font-semibold tracking-wide text-muted">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Platform cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="glass-card rounded-3xl p-6 md:p-8 h-full shadow-sm shadow-[#c9b89a]/20">
                            <p className="text-sm md:text-base font-bold tracking-wide text-primary mb-2">
                                {t("about.whatIbuild")}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-ink">
                                {t("about.buildTitle")}
                            </h3>
                            <p className="text-sm md:text-base text-muted leading-relaxed mb-7">
                                {t("about.buildDesc")}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {platforms.map((platform, i) => (
                                    <motion.div
                                        key={platform.key}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                                        className="group relative rounded-2xl border border-line bg-[#fffdf9] p-5 overflow-hidden transition-colors hover:border-primary/45"
                                    >
                                        <div
                                            className={`absolute -right-12 -top-12 w-28 h-28 rounded-full ${platform.tint}`}
                                        />
                                        <div className="relative flex items-center gap-2 mb-3">
                                            <platform.icon size={20} className={platform.iconColor} />
                                            <h4 className="font-bold text-ink">{platform.title}</h4>
                                            {platform.badge && (
                                                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-[#8a6d2f]/12 text-[#7a5f26] border border-[#8a6d2f]/25">
                                                    {platform.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="relative text-sm text-muted leading-relaxed">
                                            {platform.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
