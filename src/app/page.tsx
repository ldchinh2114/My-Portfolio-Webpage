import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SiteBackground } from "@/components/SiteBackground";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SiteBackground />

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
