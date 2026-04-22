"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Hero = () => {
    const { t } = useLanguage();

    return (
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 max-w-6xl mx-auto overflow-hidden">
            {/* Background Elements - Subtle */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1 rounded-full bg-gray-100 text-[10px] md:text-xs font-semibold mb-8 uppercase tracking-widest text-gray-600 transform-gpu"
                >
                    {t("hero.badge")}
                </motion.span>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] md:leading-[0.85] mb-6 md:mb-10 text-gray-950 transform-gpu">
                    <span className="block">{t("hero.title")}</span>
                    <span className="text-gray-400 block">{t("hero.subtitle")}</span>
                    <span className="block">{t("hero.title2")}</span>
                </h1>

                <p className="text-base md:text-xl lg:text-2xl text-gray-500 max-w-2xl leading-relaxed mb-8 md:12 font-medium transform-gpu">
                    {t("hero.description")}
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                >
                    <a
                        href="#projects"
                        className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-gray-950 text-white font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group transform-gpu text-center"
                    >
                        {t("hero.viewProjects")}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href="#contact"
                        className="px-8 md:px-10 py-3 md:py-4 rounded-full border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-all backdrop-blur-sm transform-gpu text-center"
                    >
                        {t("hero.contactMe")}
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};
