"use client";

/**
 * Projects — portfolio project cards with tags and GitHub links.
 * Staggered scroll animations; responsive grid (1 col mobile, 2 col tablet+).
 */

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/SocialIcons";
import { projects } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Projects() {
  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="section-underline font-heading text-3xl font-bold text-white sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Selected work spanning computer vision, NLP, embedded systems, and
            full-stack applications.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.article
              key={project.title}
              variants={cardVariants}
              className="group flex flex-col rounded-xl border border-white/10 bg-surface p-6 shadow-glow transition-all hover:border-accent-purple/30 hover:shadow-glow-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-xl font-semibold text-white group-hover:text-gradient">
                  {project.title}
                </h3>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                    className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-accent-purple"
                  >
                    <GitHubIcon size={20} />
                  </a>
                )}
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 sm:text-base">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-accent-purple/10 px-2.5 py-1 text-xs font-medium text-accent-cyan"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-purple transition-colors hover:text-accent-cyan"
                >
                  View on GitHub
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span
                  className="mt-5 inline-flex cursor-not-allowed items-center gap-1.5 text-sm font-medium text-zinc-500 opacity-60"
                  aria-disabled="true"
                >
                  Coming Soon
                </span>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
