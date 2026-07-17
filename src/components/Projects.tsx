"use client";

/**
 * Projects — equal-height cards with lift hover and staggered entrance.
 */

import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, FolderGit2 } from "lucide-react";
import { GitHubIcon } from "@/components/icons/SocialIcons";
import { projects } from "@/lib/data";
import {
  fadeUpVariants,
  sectionViewport,
  staggerContainer,
} from "@/lib/motion";

export default function Projects() {
  const reduced = useReducedMotion();
  const item = fadeUpVariants(reduced);
  const container = staggerContainer(reduced);

  return (
    <section
      id="projects"
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
            Projects
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Selected work spanning computer vision, NLP, embedded systems, and
            full-stack applications.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="grid gap-6 md:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.article
              key={project.title}
              variants={item}
              whileHover={
                reduced ? undefined : { y: -8, transition: { duration: 0.25 } }
              }
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-surface shadow-glow transition-shadow duration-300 hover:border-accent-purple/35 hover:shadow-glow-hover"
            >
              {/* Accent header bar */}
              <div className="relative h-1.5 overflow-hidden bg-white/5">
                <div className="absolute inset-0 origin-left scale-x-0 bg-gradient-accent transition-transform duration-500 group-hover:scale-x-100" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-cyan transition-colors group-hover:bg-accent-purple/25">
                      <FolderGit2 size={20} aria-hidden="true" />
                    </span>
                    <h3 className="font-heading text-xl font-semibold text-white transition-colors group-hover:text-gradient">
                      {project.title}
                    </h3>
                  </div>
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

                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/5 bg-accent-purple/10 px-2.5 py-1 text-xs font-medium text-accent-cyan"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 border-t border-white/5 pt-4">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-purple transition-colors hover:text-accent-cyan"
                    >
                      View on GitHub
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <span
                      className="inline-flex cursor-not-allowed items-center gap-1.5 text-sm font-medium text-zinc-500"
                      aria-disabled="true"
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
