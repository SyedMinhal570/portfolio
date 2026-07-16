"use client";

/**
 * Hero — first viewport section with name, tagline, CTA buttons, and social links.
 * Uses Framer Motion for entrance animation on page load.
 */

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { isSocialLinkActive, personalInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-4 pt-24 sm:px-6 lg:px-8"
    >
      {/* Subtle gradient glow behind hero content */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-purple/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-accent-cyan/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-sm font-medium uppercase tracking-widest text-accent-cyan sm:text-base"
        >
          Portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="text-gradient">{personalInfo.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl"
        >
          {personalInfo.tagline}
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-accent px-8 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-hover hover:brightness-110"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-surface px-8 py-3 text-sm font-semibold text-white transition-all hover:border-accent-purple/50 hover:shadow-glow"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <a
            href={personalInfo.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-accent-purple"
          >
            <GitHubIcon size={22} />
          </a>
          {isSocialLinkActive(personalInfo.social.linkedin) && (
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-accent-cyan"
            >
              <LinkedInIcon size={22} />
            </a>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 inline-flex flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-accent-cyan"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ArrowDown size={20} className="animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
