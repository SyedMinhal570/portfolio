"use client";

/**
 * Experience — vertical timeline with icon markers and scroll entrance.
 */

import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { experience } from "@/lib/data";
import {
  fadeUpVariants,
  sectionViewport,
  staggerContainer,
} from "@/lib/motion";

export default function Experience() {
  const reduced = useReducedMotion();
  const item = fadeUpVariants(reduced);
  const container = staggerContainer(reduced);

  return (
    <section
      id="experience"
      className="section-padding scroll-mt-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={item}
          className="mb-10 md:mb-12"
        >
          <h2 className="section-underline font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Experience & Education
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            My academic background and leadership experience.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="relative space-y-8"
        >
          <div
            className="absolute left-[1.35rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-accent-purple via-accent-cyan/60 to-transparent sm:block"
            aria-hidden="true"
          />

          {experience.map((entry) => (
            <motion.article
              key={`${entry.title}-${entry.organization}`}
              variants={item}
              className="relative sm:pl-16"
            >
              <div
                className="absolute left-0 top-6 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface text-accent-cyan shadow-glow sm:flex"
                aria-hidden="true"
              >
                {entry.type === "education" ? (
                  <GraduationCap size={20} />
                ) : (
                  <Briefcase size={20} />
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-surface p-6 shadow-glow transition-shadow hover:shadow-glow-hover">
                <div className="flex items-start gap-4 sm:block">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-cyan sm:hidden">
                    {entry.type === "education" ? (
                      <GraduationCap size={20} aria-hidden="true" />
                    ) : (
                      <Briefcase size={20} aria-hidden="true" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-accent-cyan">
                      {entry.period}
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-white">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-zinc-300">
                      {entry.organization}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
