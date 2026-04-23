"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Bookmark } from "lucide-react";

const navLinks = [
  { href: "/books", label: "Books" },
  { href: "/quran", label: "Quran" },
  { href: "/duas", label: "Duas" },
  { href: "/lectures", label: "Lectures" },
  { href: "/khutbas", label: "Khutbas" },
  { href: "/why-islam", label: "Why Islam" },
  { href: "/guides", label: "Islamic Guides" },
  { href: "/wisdom", label: "Wisdom" },
  { href: "/donate", label: "Donate" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  // Close on Escape + lock body scroll
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav className="bg-teal-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14">
          {/* Logo */}
          <div className="flex-1 flex justify-start min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity min-w-0"
            >
              <Image
                src="/logo.png"
                alt="Ilm Library"
                width={36}
                height={36}
                className="rounded-md shrink-0"
                priority
              />
              <span className="text-lg sm:text-xl font-bold tracking-wide font-[family-name:var(--font-amiri)] truncate">
                Ilm Library
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center justify-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-3 py-2 text-base font-bold text-white transition-colors after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-white after:transition-transform after:origin-center ${
                    isActive(link.href)
                      ? "after:scale-x-100"
                      : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex-1 flex justify-end items-center gap-2">
            <Link
              href="/bookmarks"
              className="hidden lg:block p-2 text-white hover:text-teal-100 transition-colors"
              title="My Bookmarks"
            >
              <Bookmark size={18} />
            </Link>

            {/* Mobile: bookmark + hamburger */}
            <div className="flex items-center gap-1 lg:hidden">
              <Link
                href="/bookmarks"
                className="p-2 text-white hover:text-teal-100 transition-colors"
                title="My Bookmarks"
              >
                <Bookmark size={18} />
              </Link>
              <button
                className="p-2 -mr-2 rounded-md active:bg-teal-800 transition-colors"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <span className="relative block w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-14 z-40 bg-teal-900 text-white shadow-[0_12px_24px_rgba(0,0,0,0.2)] origin-top transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <ul className="px-4 py-3 space-y-1 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              style={{
                transitionDelay: isOpen ? `${i * 25}ms` : "0ms",
              }}
              className={`transition-all duration-300 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              <Link
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-teal-800 text-white"
                    : "text-teal-50 active:bg-teal-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
