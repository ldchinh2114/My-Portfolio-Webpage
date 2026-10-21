"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Download,
    FileText,
} from "lucide-react";
import type { NoteSummary } from "@/lib/notes";
import { useLanguage } from "@/context/LanguageContext";
import { formatNoteDate } from "@/components/notes/format";

interface NoteViewProps {
    note: NoteSummary;
    children: React.ReactNode;
}

export const NoteView = ({ note, children }: NoteViewProps) => {
    const { t, language } = useLanguage();

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/notes"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
            >
                <ArrowLeft size={16} />
                {t("notes.back")}
            </Link>

            <motion.header
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="mt-6 md:mt-8"
            >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
                    <span className="chip px-2.5 py-1 font-semibold">
                        {t(`notes.lang.${note.language}`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {t("notes.published")}
                        <time dateTime={note.date}>
                            {formatNoteDate(note.date, language)}
                        </time>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {note.readingMinutes} {t("notes.minRead")}
                    </span>
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
                    {note.title}
                </h1>

                {note.summary && (
                    <p className="mt-4 text-lg text-muted leading-relaxed text-balance">
                        {note.summary}
                    </p>
                )}

                {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
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
            </motion.header>

            <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="note-prose mt-10"
            >
                {children}
            </motion.article>

            {note.downloads.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    aria-labelledby="note-downloads"
                    className="mt-10 glass-card rounded-2xl p-5"
                >
                    <div className="flex items-center gap-2">
                        <Download size={16} className="text-primary" />
                        <h2
                            id="note-downloads"
                            className="text-sm font-bold tracking-wide uppercase text-ink"
                        >
                            {t("notes.downloads")}
                        </h2>
                    </div>
                    <p className="mt-1 text-xs text-muted">{t("notes.downloadHint")}</p>

                    <ul className="mt-3 divide-y divide-line">
                        {note.downloads.map((download) => {
                            const isExternal = download.href.startsWith("http");

                            return (
                                <li key={download.href}>
                                    <a
                                        href={download.href}
                                        download={isExternal ? undefined : true}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        className="group flex items-center gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
                                    >
                                        <span className="p-2 rounded-lg border border-line bg-chip text-primary">
                                            <FileText size={16} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                                                {download.label}
                                            </span>
                                            {download.meta && (
                                                <span className="block text-xs text-muted">
                                                    {download.meta}
                                                </span>
                                            )}
                                        </span>
                                        <Download
                                            size={16}
                                            className="text-muted group-hover:text-primary transition-colors"
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </motion.section>
            )}

            <div className="mt-12 pt-6 border-t border-line">
                <Link
                    href="/notes"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
                >
                    <ArrowLeft size={16} />
                    {t("notes.back")}
                </Link>
            </div>
        </div>
    );
};
