import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-5 py-16 fade-in-up">
      <div className="max-w-xl w-full text-center">
        <p className="text-[120px] md:text-[160px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-none">
          404
        </p>
        <h1 className="text-[26px] sm:text-[32px] md:text-[38px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-tight mt-2 mb-3">
          Page Not Found
        </h1>
        <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[20px] leading-[1.6] max-w-md mx-auto mb-8">
          The page you&apos;re looking for may have been moved, renamed, or
          doesn&apos;t exist. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-teal-900 hover:bg-teal-800 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-teal-900 font-medium px-6 py-3 rounded-full border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          >
            <Search size={16} />
            Browse Books
          </Link>
        </div>
      </div>
    </section>
  );
}
