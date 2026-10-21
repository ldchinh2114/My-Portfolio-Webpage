"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code, Server, Database, Terminal, Layout, Brain } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Skills = () => {
    const { t } = useLanguage();

    const skills = [
        {
            category: t("skills.cat.ai"),
            items: [
                t("skills.item.t3"),
                t("skills.item.opencode"),
                t("skills.item.deepseek"),
                t("skills.item.cline"),
                t("skills.item.grok"),
            ],
            icon: Brain,
            tint: "bg-[#c2571f]/10",
            iconColor: "text-primary",
        },
        {
            category: t("skills.cat.languages"),
            items: [
                t("skills.item.java"),
                t("skills.item.csharp"),
                t("skills.item.javascript"),
                t("skills.item.htmlcss"),
            ],
            icon: Code,
            tint: "bg-[#b08236]/12",
            iconColor: "text-secondary",
        },
        {
            category: t("skills.cat.backend"),
            items: [
                t("skills.item.dotnet"),
                t("skills.item.restapi"),
                t("skills.item.springboot"),
            ],
            icon: Server,
            tint: "bg-[#8a8c4a]/14",
            iconColor: "text-[#7c7e3c]",
        },
        {
            category: t("skills.cat.database"),
            items: [t("skills.item.mssql"), t("skills.item.mysql")],
            icon: Database,
            tint: "bg-[#a8452c]/10",
            iconColor: "text-accent",
        },
        {
            category: t("skills.cat.tools"),
            items: [t("skills.item.git"), t("skills.item.vscode"), t("skills.item.postman")],
            icon: Terminal,
            tint: "bg-[#a5764a]/12",
            iconColor: "text-[#96683f]",
        },
        {
            category: t("skills.cat.others"),
            items: [
                t("skills.item.nextjs"),
                t("skills.item.tailwindcss"),
                t("skills.item.reactnative"),
                t("skills.item.unity"),
            ],
            icon: Layout,
            tint: "bg-[#8a7a63]/12",
            iconColor: "text-[#7a6a53]",
        },
    ];

    return (
        <section id="skills" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b89a]/60 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[460px] h-[460px] warm-glow-gold" />
            </div>

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
                        {t("skills.technical")}{" "}
                        <span className="accent-text">{t("skills.title")}</span>
                    </h2>
                    <p className="mt-4 text-muted max-w-xl mx-auto text-balance">
                        {t("skills.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skillGroup, index) => (
                        <motion.div
                            key={skillGroup.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: index * 0.07, duration: 0.6 }}
                            className="group relative glass-card rounded-2xl p-6 overflow-hidden hover:border-primary/40 transition-colors"
                        >
                            <div
                                className={`absolute -right-12 -top-12 w-32 h-32 rounded-full ${skillGroup.tint}`}
                            />
                            <div className="relative flex items-center gap-3 mb-5">
                                <div className={`p-2.5 rounded-xl border border-line ${skillGroup.tint}`}>
                                    <skillGroup.icon size={20} className={skillGroup.iconColor} />
                                </div>
                                <h3 className="text-lg font-bold text-ink">{skillGroup.category}</h3>
                            </div>

                            <div className="relative flex flex-wrap gap-2">
                                {skillGroup.items.map((skill, i) => (
                                    <span key={i} className="chip px-3 py-1 text-[13px] font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
