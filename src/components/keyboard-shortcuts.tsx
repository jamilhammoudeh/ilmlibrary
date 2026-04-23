"use client";

import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      // "/" to focus search
      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="text"][placeholder*="Search"], input[type="text"][placeholder*="search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      // "Escape" to close modals
      if (e.key === "Escape") {
        const modal = document.querySelector("[data-modal-overlay]");
        if (modal) {
          (modal as HTMLElement).click();
        }
      }

    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
