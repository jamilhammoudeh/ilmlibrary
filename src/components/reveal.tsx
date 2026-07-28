"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Easing shared with the site's hand-tuned CSS transitions (the nav pill,
// dropdowns, drawer), so JS-driven entrances feel of-a-piece with the rest.
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

type RevealTag = keyof typeof MOTION_TAGS;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Travel distance (px) of the upward fade-in. */
  y?: number;
  delay?: number;
  duration?: number;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
  /** Fraction of the element visible before it fires. */
  amount?: number;
  as?: RevealTag;
};

// Fade-and-rise a block as it scrolls into view. A no-op under
// prefers-reduced-motion (renders the content with no transform).
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.25,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const M = MOTION_TAGS[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

// Parent/child pair for staggered grids and rails. Put `staggerContainer` on
// the wrapper (with initial="hidden" whileInView="show") and `staggerItem` on
// each child; the children rise in sequence as the wrapper enters view.
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
