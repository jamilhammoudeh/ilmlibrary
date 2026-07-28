"use client";

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Both the admin shell and the Quran reader replace the site navbar with
  // their own chrome, so neither needs the fixed-navbar offset.
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isReader = pathname?.startsWith("/quran/read") ?? false;
  return (
    <main className={`flex-1 ${isAdmin || isReader ? "" : "pt-14"}`}>
      {children}
    </main>
  );
}
