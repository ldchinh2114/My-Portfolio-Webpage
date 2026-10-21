"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, Facebook, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Contact = () => {
    const { t } = useLanguage();

    const socials = [
        { icon: Github, href: "https://github.com/ldchinh2114", label: "GitHub" },
        { icon: Facebook, href: "https://www.facebook.com/LeeChiinhh", label: "Facebook" },
        { icon: MessageCircle, href: "https://zalo.me/84707166199", label: "Zalo" },
        { icon: Mail, href: "mailto:chinhle6030@gmail.com", label: "Email" },
    ];

    return (
        <section id="contact" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b89a]/60 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[300px] warm-glow" />
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-[1.05]">
                        {t("contact.title")}{" "}
                        <span className="accent-text">{t("contact.subtitle")}</span>
                    </h2>
                    <p className="mt-6 text-base md:text-lg text-muted max-w-2xl mx-auto leading-relaxed italic">
                        &ldquo;{t("contact.quote")}&rdquo;
                    </p>
                </motion.div>

                {/* Social links */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.12 }}
                    className="mt-14"
                >
                    <p className="text-sm md:text-base font-bold tracking-wide text-muted text-center mb-6">
                        {t("contact.findMe")}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                className="group glass-card rounded-2xl px-4 py-6 flex flex-col items-center gap-3 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="p-3 rounded-xl bg-chip text-ink-soft group-hover:text-primary group-hover:bg-[#c2571f]/10 transition-colors">
                                    <social.icon size={22} />
                                </span>
                                <span className="text-sm font-semibold text-ink-soft group-hover:text-primary transition-colors">
                                    {social.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
