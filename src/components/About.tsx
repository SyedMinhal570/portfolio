"use client";

/**
 * About — short bio section with scroll-triggered fade/slide animation.
 */

import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
            About Me
          </h2>

          <p className="mt-8 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {personalInfo.bio}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
