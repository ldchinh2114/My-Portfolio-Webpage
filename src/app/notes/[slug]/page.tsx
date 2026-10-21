import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteMarkdown } from "@/components/notes/NoteMarkdown";
import { NoteView } from "@/components/notes/NoteView";
import { getAllNotes, getNote, toNoteSummary } from "@/lib/notes";
import type { NoteLanguage } from "@/lib/notes";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export const generateStaticParams = () => {
  return getAllNotes().map((note) => ({ slug: note.slug }));
};

export const generateMetadata = async ({
  params,
}: NotePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) {
    return { title: "Note not found — L.D.Chinh" };
  }

  // The site defaults to Vietnamese, so metadata follows the Vietnamese file.
  const translation = note.translations.vi;

  return {
    title: `${translation.title} — L.D.Chinh`,
    description: translation.summary,
    openGraph: {
      title: translation.title,
      description: translation.summary,
      type: "article",
      publishedTime: note.date,
    },
  };
};

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) notFound();

  // Both bodies are rendered here on the server and cross into the client
  // `NoteView` as props, so `react-markdown` never ships to the browser.
  const bodies: Record<NoteLanguage, ReactNode> = {
    vi: <NoteMarkdown content={note.translations.vi.content} />,
    en: <NoteMarkdown content={note.translations.en.content} />,
  };

  return <NoteView note={toNoteSummary(note)} bodies={bodies} />;
}
