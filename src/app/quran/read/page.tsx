import type { Metadata } from "next";
import { QuranWebApp } from "@/components/quran-web-app";

export const metadata: Metadata = {
  title: "Read the Quran",
  description:
    "Read the full Quran in the Madinah mushaf with English translation, tafseer, tajweed colouring, word-by-word meanings, bookmarks, and ayah audio from a choice of reciters.",
  openGraph: {
    title: "Read the Quran | Ilm Library",
    description:
      "Read the full Quran in the Madinah mushaf with English translation, tafseer, tajweed colouring, word-by-word meanings, bookmarks, and ayah audio.",
    url: "/quran/read",
  },
};

export default function QuranReadPage() {
  return <QuranWebApp />;
}
