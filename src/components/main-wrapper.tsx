"use client";

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  return (
    <main className={`flex-1 ${isAdmin ? "" : "pt-14"}`}>{children}</main>
  );
}
