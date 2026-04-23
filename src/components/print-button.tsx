"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 transition-colors"
    >
      <Printer size={15} />
      Print
    </button>
  );
}
