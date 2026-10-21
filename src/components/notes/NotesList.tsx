"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock3, Download, NotebookPen } from "lucide-react";
import type { NoteSummary } from "@/lib/notes";
import { useLanguage } from "@/context/LanguageContext";
import { formatNoteDate } from "@/components/notes/format";

export const NotesList = ({ notes }: { notes: NoteSummary[] }) => {
    const { t, language } = useLanguage();

    return (
        <div className="max-w-3xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="mb-10 md:mb-14"
            >
                <p className="text-xs font-bold tracking-[0.22em] uppercase text-secondary mb-3">
                    {t("notes.eyebrow")}
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {t("notes.title")}
                    <span className="accent-text">.</span>
                </h1>
                <p className="mt-4 text-muted max-w-2xl text-balance">
                    {t("notes.subtitle")}
                </p>
                <p className="mt-3 text-sm font-semibold text-ink-soft">
                    {notes.length} {t(notes.length === 1 ? "notes.countOne" : "notes.count")}
                </p>
            </motion.header>

            {notes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                    className="glass-card rounded-2xl p-8 md:p-12 flex flex-col items-center text-center"
                >
                    <span className="p-4 rounded-2xl border border-line bg-chip text-primary mb-5">
                        <NotebookPen size={28} strokeWidth={1.4} />
                    </span>
                    <h2 className="text-xl font-bold text-ink">{t("notes.empty.title")}</h2>
                    <p className="mt-2 text-sm text-muted max-w-md">
                        {t("notes.empty.desc")}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-5">
                    {notes.map((note, index) => (
                        <motion.article
                            key={note.slug}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: index * 0.08, duration: 0.6 }}
                            className="h-full"
                        >
                            <Link
                                href={`/notes/${note.slug}`}
                                className="group flex h-full flex-col glass-card rounded-2xl p-6 hover:border-primary/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted mb-4">
                                    <span className="chip px-2.5 py-1 font-semibold">
                                        {t(`notes.lang.${note.language}`)}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarDays size={13} />
                                        <time dateTime={note.date}>
                                            {formatNoteDate(note.date, language)}
                                        </time>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock3 size={13} />
                                        {note.readingMinutes} {t("notes.minRead")}
                                    </span>
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-ink group-hover:text-primary transition-colors">
                                    {note.title}
                                </h2>

                                {note.summary && (
                                    <p className="mt-2 text-sm text-muted leading-relaxed">
                                        {note.summary}
                                    </p>
                                )}

                                {note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {note.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-line bg-chip text-ink-soft"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                                        {t("notes.readNote")}
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </span>
                                    {note.downloads.length > 0 && (
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft"
                                        >
                                            <Download size={14} />
                                            {note.downloads.length}{" "}
                                            {t(
                                                note.downloads.length === 1
                                                    ? "notes.fileOne"
                                                    : "notes.file",
                                            )}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            )}
        </div>
    );
};
