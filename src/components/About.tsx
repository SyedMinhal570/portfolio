"use client";

/**
 * About — bio with icon-accented highlights and scroll-triggered motion.
 */

import { motion, useReducedMotion } from "framer-motion";
import { Cpu, GraduationCap, Layers, Sparkles } from "lucide-react";
import { personalInfo } from "@/lib/data";
import {
  fadeUpVariants,
  sectionViewport,
  staggerContainer,
} from "@/lib/motion";

const highlights = [
  {
    icon: GraduationCap,
    title: "Computer Engineering",
    detail: "Undergraduate at ITU Lahore",
  },
  {
    icon: Cpu,
    title: "Embedded Systems",
    detail: "STM32, Arduino, hardware–software systems",
  },
  {
    icon: Sparkles,
    title: "AI / ML",
    detail: "Computer vision, NLP, and deployed models",
  },
  {
    icon: Layers,
    title: "Full-Stack",
    detail: "MERN internship & production web apps",
  },
];

export default function About() {
  const reduced = useReducedMotion();
  const item = fadeUpVariants(reduced);
  const container = staggerContainer(reduced);

  return (
    <section
      id="about"
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
            About Me
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            A quick look at who I am and what I build.
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={item}
            className="lg:col-span-3"
          >
            <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
              {personalInfo.bio}
            </p>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={container}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1"
          >
            {highlights.map(({ icon: Icon, title, detail }) => (
              <motion.li
                key={title}
                variants={item}
                className="flex gap-3 rounded-xl border border-white/10 bg-surface p-4 shadow-glow transition-shadow hover:shadow-glow-hover"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-cyan">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-white">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-zinc-400">
                    {detail}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
