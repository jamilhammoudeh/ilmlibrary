"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-teal-900 hover:bg-teal-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
