"use client";

/**
 * Skills — displays grouped skill categories in a responsive card grid.
 * Cards animate in with staggered whileInView for a polished scroll effect.
 */

import { motion } from "framer-motion";
import { skills } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Skills() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
            Skills
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Technologies and tools I work with across embedded systems, AI/ML,
            and full-stack development.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {skills.map((group) => (
            <motion.article
              key={group.category}
              variants={cardVariants}
              className="rounded-xl border border-white/10 bg-surface p-6 shadow-glow transition-shadow hover:shadow-glow-hover"
            >
              <h3 className="font-heading text-lg font-semibold text-gradient">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
