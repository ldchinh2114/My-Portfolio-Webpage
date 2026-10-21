import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteMarkdown } from "@/components/notes/NoteMarkdown";
import { NoteView } from "@/components/notes/NoteView";
import { getAllNotes, getNote } from "@/lib/notes";

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

  return {
    title: `${note.title} — L.D.Chinh`,
    description: note.summary,
    openGraph: {
      title: note.title,
      description: note.summary,
      type: "article",
      publishedTime: note.date,
    },
  };
};

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) notFound();

  const { content, ...summary } = note;

  return (
    <NoteView note={summary}>
      <NoteMarkdown content={content} />
    </NoteView>
  );
}
