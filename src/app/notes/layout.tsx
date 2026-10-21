import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteBackground } from "@/components/SiteBackground";

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <SiteBackground />
      <Navbar />

      <main className="relative pt-28 md:pt-36 pb-20 px-4 md:px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
