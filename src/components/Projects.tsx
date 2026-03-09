"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Folder } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const projects = [
    {
        titleKey: "projects.recorder.title",
        descKey: "projects.recorder.desc",
        tags: ["C#", ".NET", "Windows API"],
        color: "from-purple-500 to-indigo-700",
        image: "/action-recorder.jpg",
        github: "https://github.com/Liqing1124/User-Action-Recorder",
        demo: "#"
    },
    {
        titleKey: "projects.extractor.title",
        descKey: "projects.extractor.desc",
        tags: ["C#", "Winforms"],
        color: "from-blue-500 to-cyan-700",
        image: "/text-extractor.jpg",
        github: "https://github.com/Liqing1124/Text-Extractor",
        demo: "#"
    }
];

export const Projects = () => {
    const { t } = useLanguage();

    return (
        <section id="projects" className="py-12 relative z-10">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tight text-gray-950 uppercase"
                >
                    {t("projects.featured")} <span className="text-gray-400">{t("projects.title")}</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-200 group"
                        >
                            <div className="relative overflow-hidden h-48">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={project.image}
                                    alt={t(project.titleKey)}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="px-3 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
                                        {project.tags[0]}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-500 transition-colors">
                                    {t(project.titleKey)}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {t(project.descKey)}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 border border-gray-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-500 transition-colors"
                                    >
                                        <Github size={18} />
                                        {t("projects.viewCode")}
                                    </a>
                                    {project.demo !== "#" && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-500 transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                            {t("projects.liveDemo")}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
