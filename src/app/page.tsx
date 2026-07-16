/**
 * Homepage — composes all portfolio sections as separate components.
 * Each section lives in /components for modularity and easier video walkthroughs.
 */

import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <ContactForm />
      <Footer />
    </>
  );
}
