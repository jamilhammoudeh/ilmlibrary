"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Ornament } from "@/components/ornament";

const libraryLinks = [
  { href: "/books", label: "Books" },
  { href: "/quran", label: "Quran" },
  { href: "/duas", label: "Duas" },
  { href: "/lectures", label: "Lectures" },
];

const learnLinks = [
  { href: "/why-islam", label: "Why Islam" },
  { href: "/guides", label: "Islamic Guides" },
  { href: "/wisdom", label: "Wisdom" },
  { href: "/donate", label: "Donate" },
  { href: "/about", label: "About" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="relative bg-teal-900 text-white mt-auto">
      {/* Gold hairline along the top edge */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
      />
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="Ilm Library"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="leading-tight">
                <span className="block text-lg font-bold tracking-wide font-[family-name:var(--font-amiri)]">
                  Ilm Library
                </span>
                <span
                  className="block text-sm text-gold-400/90 font-[family-name:var(--font-amiri)]"
                  lang="ar"
                  dir="rtl"
                >
                  مكتبة العلم
                </span>
              </span>
            </Link>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              Access Islamic Knowledge and Resources rooted in the Qur&apos;an
              and Sunnah, interpreted through the understanding of the Salaf.
            </p>
          </div>

          {/* Library links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400/90 mb-4">
              Library
            </h4>
            <ul className="space-y-2.5">
              {libraryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-teal-100 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400/90 mb-4">
              Learn
            </h4>
            <ul className="space-y-2.5">
              {learnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-teal-100 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400/90 mb-4">
              Get in Touch
            </h4>
            <p className="text-sm text-teal-100/90 mb-4 leading-relaxed">
              Have questions or suggestions? Reach out to us.
            </p>
            <Link
              href="/about"
              className="inline-block bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Ornament tone="light" className="mb-4" />
          <p className="font-[family-name:var(--font-amiri)] text-teal-50 text-lg mb-1.5">
            If this site benefits you, please make a dua for us and share it
            with someone.
          </p>
          <p className="text-sm text-teal-100/60">
            &copy; {new Date().getFullYear()} Ilm Library. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
