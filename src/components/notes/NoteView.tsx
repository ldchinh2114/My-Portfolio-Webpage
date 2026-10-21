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
import type { NoteLanguage, NoteSummary } from "@/lib/notes";
import { useLanguage } from "@/context/LanguageContext";
import { formatNoteDate } from "@/components/notes/format";

interface NoteViewProps {
    note: NoteSummary;
    /** One server-rendered Markdown body per language; the switch picks one. */
    bodies: Record<NoteLanguage, React.ReactNode>;
}

export const NoteView = ({ note, bodies }: NoteViewProps) => {
    const { t, language, setLanguage } = useLanguage();
    const activeLanguage = note.languages.includes(language) ? language : note.languages[0];
    const translation = note.translations[activeLanguage];

    // `generateMetadata` runs on the server, which cannot see the saved client
    // language. Apply the title after hydration paints so Next's server
    // metadata does not immediately overwrite it. The cleanup runs on
    // navigation, letting the next route own the title again.
    React.useEffect(() => {
        const title = `${translation.title} — L.D.Chinh`;
        let frame = window.requestAnimationFrame(() => {
            frame = window.requestAnimationFrame(() => {
                document.title = title;
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [translation.title]);

    return (
        <div className="max-w-3xl mx-auto" lang={activeLanguage}>
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
                    <div
                        role="group"
                        aria-label={t("notes.readIn")}
                        className="inline-flex items-center gap-0.5 rounded-full border border-line bg-chip p-0.5"
                    >
                        {note.languages.map((noteLanguage) => {
                            const isActive = noteLanguage === activeLanguage;

                            return (
                                <button
                                    key={noteLanguage}
                                    type="button"
                                    onClick={() => setLanguage(noteLanguage)}
                                    aria-pressed={isActive}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                                        isActive
                                            ? "bg-gradient-to-r from-primary to-secondary text-[#fffaf4]"
                                            : "text-ink-soft hover:text-primary"
                                    }`}
                                >
                                    {t(`notes.lang.${noteLanguage}`)}
                                </button>
                            );
                        })}
                    </div>
                    <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {t("notes.published")}
                        <time dateTime={note.date}>
                            {formatNoteDate(note.date, language)}
                        </time>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {translation.readingMinutes} {t("notes.minRead")}
                    </span>
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
                    {translation.title}
                </h1>

                {translation.summary && (
                    <p className="mt-4 text-lg text-muted leading-relaxed text-balance">
                        {translation.summary}
                    </p>
                )}

                {translation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
                        {translation.tags.map((tag) => (
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
                {bodies[activeLanguage]}
            </motion.article>

            {translation.downloads.length > 0 && (
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
                        {translation.downloads.map((download) => {
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
