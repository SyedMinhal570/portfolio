"use client";

/**
 * Experience — education and work timeline with scroll animations.
 * Uses a vertical timeline layout on larger screens.
 */

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { experience } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Experience() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
            Experience & Education
          </h2>
          <p className="mt-4 text-zinc-400">
            My academic background and leadership experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative space-y-8"
        >
          {/* Vertical timeline line (hidden on very small screens) */}
          <div
            className="absolute left-6 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-accent sm:block"
            aria-hidden="true"
          />

          {experience.map((item) => (
            <motion.article
              key={`${item.title}-${item.organization}`}
              variants={itemVariants}
              className="relative rounded-xl border border-white/10 bg-surface p-6 pl-6 sm:pl-16 shadow-glow"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-4 top-8 hidden h-4 w-4 rounded-full border-2 border-accent-purple bg-background sm:block"
                aria-hidden="true"
              />

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-cyan sm:absolute sm:left-2 sm:top-6">
                  {item.type === "education" ? (
                    <GraduationCap size={20} />
                  ) : (
                    <Briefcase size={20} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-accent-cyan">
                    {item.period}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-zinc-300">
                    {item.organization}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
