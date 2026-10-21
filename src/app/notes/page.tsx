import type { Metadata } from "next";
import { NotesList } from "@/components/notes/NotesList";
import { getAllNotes } from "@/lib/notes";

const description =
  "Short notes, write-ups and downloadable files from L.D.Chinh.";

export const metadata: Metadata = {
  title: "Notes — L.D.Chinh",
  description,
  openGraph: {
    title: "Notes — L.D.Chinh",
    description,
    type: "website",
  },
};

export default function NotesPage() {
  return <NotesList notes={getAllNotes()} />;
}
