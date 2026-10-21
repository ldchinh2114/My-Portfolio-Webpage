"use client";
import React from "react";
import { Github, Mail, Facebook, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
    const { t } = useLanguage();

    const socials = [
        { icon: Github, href: "https://github.com/ldchinh2114", label: "GitHub" },
        { icon: Facebook, href: "https://www.facebook.com/LeeChiinhh", label: "Facebook" },
        { icon: MessageCircle, href: "https://zalo.me/84707166199", label: "Zalo" },
        { icon: Mail, href: "mailto:chinhle6030@gmail.com", label: "Email" },
    ];

    return (
        <footer className="relative border-t border-line bg-[#fffdf9]/70">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-extrabold tracking-tight">
                        L.D.Chinh<span className="accent-text">.</span>
                    </h3>
                    <p className="text-sm text-muted mt-2">{t("contact.footer")}</p>
                </div>

                <div className="flex items-center gap-3">
                    {socials.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target={social.href.startsWith("mailto") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="p-2.5 rounded-xl border border-line bg-chip text-ink-soft hover:text-primary hover:border-primary/50 hover:bg-[#c2571f]/10 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <social.icon size={18} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};
