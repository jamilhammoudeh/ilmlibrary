"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";

// Transient feedback (copy confirmations and failures) whenever the audio bar
// is not mounted; notify() routes to the bar's label line when it is.
export function ReaderToast({ message }: { message: string | null }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[80] rounded-xl border border-border bg-[var(--glass-paper-strong)] px-4 py-2.5 text-sm font-semibold text-foreground shadow-[0_18px_50px_-12px_rgba(30,24,18,0.28)] backdrop-blur-xl"
          style={reduce ? { transform: "translateX(-50%)" } : undefined}
          initial={reduce ? false : { opacity: 0, x: "-50%", y: 8 }}
          animate={reduce ? undefined : { opacity: 1, x: "-50%", y: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: "-50%", y: 8 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
