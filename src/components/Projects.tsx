"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Monitor, Globe, Gamepad2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const projects = [
    {
        titleKey: "projects.recorder.title",
        descKey: "projects.recorder.desc",
        kindKey: "projects.kind.desktop",
        tags: ["C#", ".NET", "Windows API"],
        icon: Monitor,
        cover: "from-[#f6e3d2] via-[#fbf1e6] to-[#fffdf9]",
        iconColor: "text-[#b8551f]",
        github: "https://github.com/ldchinh2114/User-Action-Recorder",
        demo: null,
    },
    {
        titleKey: "projects.extractor.title",
        descKey: "projects.extractor.desc",
        kindKey: "projects.kind.desktop",
        tags: ["C#", "WinForms", "OCR"],
        icon: Monitor,
        cover: "from-[#f4e8cf] via-[#fbf5e9] to-[#fffdf9]",
        iconColor: "text-[#9a7020]",
        github: "https://github.com/ldchinh2114/Text-Extractor",
        demo: null,
    },
    {
        titleKey: "projects.multitool.title",
        descKey: "projects.multitool.desc",
        kindKey: "projects.kind.web",
        tags: ["Next.js", "React", "Tailwind CSS"],
        icon: Globe,
        cover: "from-[#efe0d2] via-[#f8efe6] to-[#fffdf9]",
        iconColor: "text-[#a8452c]",
        github: "https://github.com/ldchinh2114/multitool",
        demo: "https://ldchinh-multitool.vercel.app/",
    },
    {
        titleKey: "projects.game.title",
        descKey: "projects.game.desc",
        kindKey: "projects.kind.game",
        tags: ["AI", "Game Dev", "Unity"],
        icon: Gamepad2,
        cover: "from-[#f3dfd2] via-[#faeee4] to-[#fffdf9]",
        iconColor: "text-[#8a6d2f]",
        github: null,
        demo: null,
        badge: true,
    },
];

export const Projects = () => {
    const { t } = useLanguage();

    return (
        <section id="projects" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b89a]/60 to-transparent" />
                <div className="absolute top-1/4 left-0 w-[440px] h-[440px] warm-glow" />
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
                        {t("projects.featured")}{" "}
                        <span className="accent-text">{t("projects.title")}</span>
                    </h2>
                    <p className="mt-4 text-muted max-w-xl mx-auto text-balance">
                        {t("projects.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {projects.map((project, index) => (
                        <motion.article
                            key={project.titleKey}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: index * 0.08, duration: 0.6 }}
                            className="group relative glass-card rounded-2xl overflow-hidden hover:border-primary/45 transition-colors"
                        >
                            <div
                                className={`relative h-36 bg-gradient-to-br ${project.cover} flex items-center justify-center`}
                            >
                                <div className="absolute inset-0 grid-bg opacity-70" />
                                <project.icon
                                    size={52}
                                    strokeWidth={1.2}
                                    className={`relative ${project.iconColor} transition-transform duration-500 group-hover:scale-110`}
                                />
                                <span className="absolute top-4 left-4 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full border border-line bg-white/80 text-ink-soft">
                                    {t(project.kindKey)}
                                </span>
                                {project.badge && (
                                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full bg-[#8a6d2f]/12 text-[#7a5f26] border border-[#8a6d2f]/30">
                                        <Sparkles size={11} />
                                        {t("about.p.game.badge")}
                                    </span>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-ink group-hover:text-primary transition-colors">
                                    {t(project.titleKey)}
                                </h3>
                                <p className="text-sm text-muted leading-relaxed mb-5">
                                    {t(project.descKey)}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-line bg-chip text-ink-soft"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-5">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
                                        >
                                            <Github size={16} />
                                            {t("projects.viewCode")}
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
                                        >
                                            <ExternalLink size={16} />
                                            {t("projects.liveDemo")}
                                        </a>
                                    )}
                                    {!project.github && !project.demo && (
                                        <span className="text-xs font-semibold tracking-wide text-[#8a6d2f]">
                                            {t("about.p.game.badge")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};
