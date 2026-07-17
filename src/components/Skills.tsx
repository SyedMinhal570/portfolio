"use client";

/**
 * Skills — category cards with lift/glow hover and consistent chip icons.
 */

import { motion, useReducedMotion } from "framer-motion";
import { Box, Brain, Code2, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { skills } from "@/lib/data";
import {
  fadeUpVariants,
  sectionViewport,
  staggerContainer,
} from "@/lib/motion";

const categoryIcons: Record<string, LucideIcon> = {
  Languages: Code2,
  "Tools & IDEs": Wrench,
  "Embedded Systems": Box,
  "AI/ML & Web": Brain,
};

export default function Skills() {
  const reduced = useReducedMotion();
  const item = fadeUpVariants(reduced);
  const container = staggerContainer(reduced);

  return (
    <section
      id="skills"
      className="section-padding scroll-mt-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={item}
          className="mb-10 md:mb-12"
        >
          <h2 className="section-underline font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Skills
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Technologies and tools I work with across embedded systems, AI/ML,
            and full-stack development.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="grid gap-6 sm:grid-cols-2"
        >
          {skills.map((group) => {
            const Icon = categoryIcons[group.category] ?? Code2;

            return (
              <motion.article
                key={group.category}
                variants={item}
                whileHover={
                  reduced
                    ? undefined
                    : { y: -6, transition: { duration: 0.25 } }
                }
                className="rounded-xl border border-white/10 bg-surface p-6 shadow-glow transition-shadow duration-300 hover:border-accent-purple/30 hover:shadow-glow-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent/20 text-accent-cyan">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-gradient">
                    {group.category}
                  </h3>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-accent-cyan/30 hover:text-white"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan/80"
                        aria-hidden="true"
                      />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
