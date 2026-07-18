/**
 * Homepage — composes all portfolio sections as separate components.
 * Section order leaves room to insert Certifications between Skills and
 * Experience later without restructuring surrounding layout rhythm.
 */

import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
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
      <Certifications />
      <Projects />
      <Experience />
      <ContactForm />
      <Footer />
    </>
  );
}
