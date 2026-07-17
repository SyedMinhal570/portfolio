import type { Transition, Variants } from "framer-motion";

/** Shared easing — matches Hero entrance style */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export const sectionViewport = { once: true, margin: "-80px" as const };

export function fadeUpVariants(reduced: boolean | null): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    };
  }
  return {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: easeOutExpo },
    },
  };
}

export function staggerContainer(reduced: boolean | null): Variants {
  if (reduced) {
    return {
      hidden: {},
      visible: { transition: { staggerChildren: 0 } },
    };
  }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };
}

export const defaultTransition: Transition = {
  duration: 0.55,
  ease: easeOutExpo,
};
