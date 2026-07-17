"use client";

/**
 * Hero — first viewport with profile photo, staggered entrance, and soft ambient motion.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { isSocialLinkActive, personalInfo } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease },
        };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 lg:px-8"
    >
      {/* Ambient background — soft blobs + faint grid */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <motion.div
          className="absolute left-1/2 top-[28%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-purple/20 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  scale: [1, 1.12, 1],
                  opacity: [0.35, 0.55, 0.35],
                }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 top-1/2 h-72 w-72 rounded-full bg-accent-cyan/15 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, -24, 0],
                  y: [0, 18, 0],
                  opacity: [0.25, 0.45, 0.25],
                }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-10 bottom-1/4 h-56 w-56 rounded-full bg-accent-purple/10 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, 20, 0],
                  y: [0, -16, 0],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Profile photo — tall rounded frame (matches portrait aspect better than a circle) */}
        <motion.div {...fadeUp(0)} className="mb-8 flex justify-center">
          <div className="relative">
            <div
              className="absolute -inset-[3px] rounded-[1.75rem] bg-gradient-accent opacity-90 shadow-glow sm:rounded-[2rem]"
              aria-hidden="true"
            />
            <div className="relative aspect-[3/4] w-36 overflow-hidden rounded-3xl border-[3px] border-background bg-[#f5f5f5] shadow-[0_0_40px_rgba(139,92,246,0.25)] sm:w-40 sm:rounded-[1.75rem] md:w-44">
              <Image
                src="/images/profile.png"
                alt={personalInfo.name}
                fill
                priority
                sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
                className="object-cover object-[50%_12%]"
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          {...fadeUp(0.12)}
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent-cyan sm:text-base"
        >
          Portfolio
        </motion.p>

        <motion.h1
          {...fadeUp(0.24)}
          className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="text-gradient">{personalInfo.name}</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.38)}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          {personalInfo.tagline}
        </motion.p>

        <motion.div
          {...fadeUp(0.52)}
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
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-surface/80 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-accent-purple/50 hover:shadow-glow"
          >
            Get In Touch
          </a>
        </motion.div>

        <motion.div
          {...fadeUp(0.64)}
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

        <motion.a
          href="#about"
          {...fadeUp(0.78)}
          className="mt-16 inline-flex flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-accent-cyan"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ArrowDown
            size={20}
            className={prefersReducedMotion ? "" : "animate-bounce"}
          />
        </motion.a>
      </div>
    </section>
  );
}
