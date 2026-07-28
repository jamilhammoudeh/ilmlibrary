"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { cx, focusRing } from "./ui";

// The reader's site-menu drawer. Replaces Tilawa's marketing NavDrawer: same
// role (every site destination lives one tap away from the reading surface),
// Ilm Library's teal panel and link set instead of Tilawa's App Store chrome.
const QURAN_LINKS = [
  { href: "/quran/read", label: "Read" },
  { href: "/quran/memorize", label: "Memorize" },
  { href: "/quran/study", label: "Study" },
  { href: "/quran/tafseer", label: "Tafseer" },
  { href: "/quran/tajweed", label: "Tajweed" },
  { href: "/quran/juz", label: "Juz index" },
  { href: "/quran/reciters", label: "Reciters" },
];

const SITE_LINKS = [
  { href: "/books", label: "Books" },
  { href: "/duas", label: "Duas" },
  { href: "/lectures", label: "Lectures" },
  { href: "/guides", label: "Islamic Guides" },
  { href: "/bookmarks", label: "My Bookmarks" },
  { href: "/donate", label: "Donate" },
  { href: "/about", label: "About" },
];

export function ReaderNavDrawer({
  open,
  onClose,
  zClass = "z-[60]",
}: {
  open: boolean;
  onClose: () => void;
  zClass?: "z-[60]" | "z-[70]";
}) {
  const reduce = useReducedMotion();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`fixed inset-0 overflow-hidden ${zClass}`}
          aria-hidden={!open}
          initial={false}
          exit={{ pointerEvents: "none" }}
        >
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-[min(22rem,88vw)] flex-col bg-teal-900 text-white shadow-[0_0_40px_rgba(0,0,0,0.35)]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
          >
            <div className="flex h-14 shrink-0 items-center justify-between px-4">
              <Link
                href="/"
                onClick={onClose}
                className={cx(
                  "flex min-w-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-90",
                  focusRing
                )}
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-md"
                />
                <span className="truncate text-lg font-bold tracking-wide font-[family-name:var(--font-amiri)]">
                  Ilm Library
                </span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className={cx(
                  "flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-teal-800 hover:text-white",
                  focusRing
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-8">
              <DrawerSection title="Quran" links={QURAN_LINKS} onClose={onClose} />
              <DrawerSection title="Library" links={SITE_LINKS} onClose={onClose} />
            </nav>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function DrawerSection({
  title,
  links,
  onClose,
}: {
  title: string;
  links: { href: string; label: string }[];
  onClose: () => void;
}) {
  return (
    <div className="pt-4">
      <p className="px-4 pb-1 text-xs font-bold uppercase tracking-wider text-teal-100/60">
        {title}
      </p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className={cx(
                "block rounded-lg px-4 py-2.5 text-base font-semibold text-teal-50 transition-colors hover:bg-teal-800 hover:text-white",
                focusRing
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
