import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Fixed background layers — painted once, never repaint while scrolling */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(70% 55% at 8% -5%, rgba(194,87,31,0.12), transparent 60%)," +
            "radial-gradient(55% 45% at 95% 2%, rgba(176,130,54,0.13), transparent 60%)," +
            "radial-gradient(60% 45% at 50% 105%, rgba(168,69,44,0.08), transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid-bg" />

      <Navbar />

      <div className="flex flex-col gap-0">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
