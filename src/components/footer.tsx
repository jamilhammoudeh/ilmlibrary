"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const libraryLinks = [
  { href: "/books", label: "Books" },
  { href: "/quran", label: "Quran" },
  { href: "/duas", label: "Duas" },
  { href: "/lectures", label: "Lectures" },
  { href: "/khutbas", label: "Khutbas" },
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
    <footer className="bg-teal-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="Ilm Library"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="text-lg font-bold tracking-wide font-[family-name:var(--font-amiri)]">
                Ilm Library
              </span>
            </Link>
            <p className="text-sm text-teal-100 leading-relaxed">
              Access Islamic Knowledge and Resources rooted in the Qur&apos;an
              and Sunnah, interpreted through the understanding of the Salaf.
            </p>
          </div>

          {/* Library links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Library
            </h4>
            <ul className="space-y-1.5">
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
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Learn
            </h4>
            <ul className="space-y-1.5">
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
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Get in Touch
            </h4>
            <p className="text-sm text-teal-100 mb-4 leading-relaxed">
              Have questions or suggestions? Reach out to us.
            </p>
            <Link
              href="/about"
              className="inline-block bg-teal-700 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-teal-800 text-center">
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
