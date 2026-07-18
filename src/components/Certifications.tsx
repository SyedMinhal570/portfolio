"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, CalendarDays, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fadeUpVariants,
  sectionViewport,
  staggerContainer,
} from "@/lib/motion";

interface Certificate {
  src: string;
  width: number;
  height: number;
  title: string;
  organization: string;
  role: string;
  date: string;
}

const certificates: Certificate[] = [
  {
    src: "/images/certificate-ieee-wie.jpeg",
    width: 1600,
    height: 1124,
    title: "IEEE WIE Certificate of Appreciation",
    organization: "IEEE WIE SBAG, ITU",
    role: "Volunteer · Tenure 2024–2025",
    date: "10th May 2026",
  },
  {
    src: "/images/certificate-iet.jpeg",
    width: 1540,
    height: 1140,
    title: "IET Certificate of Appreciation",
    organization: "IET On Campus ITU Lahore",
    role: "Management Coordinator · 2024–25",
    date: "2024–25",
  },
];

export default function Certifications() {
  const reduced = useReducedMotion();
  const item = fadeUpVariants(reduced);
  const container = staggerContainer(reduced);
  const [selected, setSelected] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  return (
    <section
      id="certifications"
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
            Certifications
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Recognition for leadership, service, and contributions to technical
            communities at ITU.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          className="grid gap-6 md:grid-cols-2"
        >
          {certificates.map((certificate) => (
            <motion.article
              key={certificate.src}
              variants={item}
              whileHover={
                reduced
                  ? undefined
                  : { y: -8, transition: { duration: 0.25 } }
              }
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-surface shadow-glow transition-shadow duration-300 hover:border-accent-purple/35 hover:shadow-glow-hover"
            >
              <button
                type="button"
                onClick={() => setSelected(certificate)}
                className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-white/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cyan"
                aria-label={`View ${certificate.title} full size`}
              >
                <Image
                  src={certificate.src}
                  alt={certificate.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/20 group-hover:opacity-100">
                  <span className="rounded-full border border-white/20 bg-background/80 px-4 py-2 text-sm font-medium text-white shadow-glow backdrop-blur-md">
                    View certificate
                  </span>
                </span>
              </button>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-cyan">
                    <Award size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold leading-snug text-white">
                      {certificate.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-accent-cyan">
                      {certificate.organization}
                    </p>
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm text-zinc-300">{certificate.role}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                  <CalendarDays
                    size={16}
                    className="text-accent-purple"
                    aria-hidden="true"
                  />
                  {certificate.date}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/15 bg-surface shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
                <p className="truncate font-heading text-sm font-semibold text-white sm:text-base">
                  {selected.title}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                  aria-label="Close certificate"
                  autoFocus
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="relative min-h-0 flex-1 overflow-auto bg-black/30 p-2 sm:p-4">
                <Image
                  src={selected.src}
                  alt={selected.title}
                  width={selected.width}
                  height={selected.height}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="mx-auto h-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
