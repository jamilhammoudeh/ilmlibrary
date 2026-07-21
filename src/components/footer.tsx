"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const browseLinks = [
  { href: "/books", label: "Books" },
  { href: "/books/authors", label: "Authors" },
  { href: "/quran", label: "Quran" },
  { href: "/duas", label: "Duas" },
  { href: "/wisdom", label: "Wisdom" },
];

const aboutLinks = [
  { href: "/why-islam", label: "Why Islam" },
  { href: "/guides", label: "Guides" },
  { href: "/donate", label: "Donate" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="bg-teal-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Browse links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Browse
            </h4>
            <ul className="space-y-1.5">
              {browseLinks.map((link) => (
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

          {/* Arabic library */}
          <div>
            <h4 className="mb-3">
              <Link
                href="/arabic"
                dir="rtl"
                lang="ar"
                className="text-lg font-bold font-[family-name:var(--font-amiri)] hover:text-teal-100 transition-colors"
              >
                المكتبة العربية
              </Link>
            </h4>
            <p className="text-base text-teal-100 font-[family-name:var(--font-amiri)] leading-relaxed">
              <span dir="rtl" lang="ar">
                كتب عربية لأهل السنة
              </span>
            </p>
          </div>

          {/* About links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
              About
            </h4>
            <ul className="space-y-1.5">
              {aboutLinks.map((link) => (
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
        </div>

        <div className="mt-8 pt-5 border-t border-teal-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-3 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Ilm Library"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-base font-bold tracking-wide font-[family-name:var(--font-amiri)]">
              Ilm Library
            </span>
          </Link>
          <p className="italic text-teal-100/90 text-sm mb-2">
            If this site benefits you, please make a dua for us and share it with someone.
          </p>
          <p className="text-sm text-teal-100/70">
            &copy; {new Date().getFullYear()} Ilm Library. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
