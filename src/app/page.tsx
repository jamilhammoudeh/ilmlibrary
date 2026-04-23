import Link from "next/link";
import Image from "next/image";
import { DuaSlideshow } from "@/components/dua-slideshow";
import { SearchBarLive } from "@/components/search-bar-live";
import { RecentlyRead } from "@/components/recently-read";

const sections = [
  { href: "/books", label: "Books", image: "/images/sections/books.jpg" },
  { href: "/quran", label: "Quran", image: "/images/sections/quran.jpg" },
  { href: "/duas", label: "Duas", image: "/images/sections/duas.jpg" },
  { href: "/lectures", label: "Lectures", image: "/images/sections/lectures.jpg" },
  { href: "/khutbas", label: "Khutbas", image: "/images/sections/khutbas.jpg" },
  { href: "/why-islam", label: "Why Islam?", image: "/images/sections/kaabah.jpeg" },
  { href: "/guides", label: "Islamic Guides", image: "/images/sections/resources.jpg" },
  { href: "/wisdom", label: "Wisdom", image: "/images/sections/wisdom.jpeg" },
  { href: "/donate", label: "Donate", image: "/images/sections/donate.jpeg" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-10 md:pt-14 pb-4 px-5 text-center">
        <h1 className="text-[44px] sm:text-[60px] md:text-[80px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-none mb-2">
          Ilm Library
        </h1>
        <p className="text-[22px] sm:text-[28px] md:text-[34px] font-normal font-[family-name:var(--font-amiri)] text-teal-900 max-w-[600px] mx-auto px-2 [text-shadow:1px_1px_16px_rgba(0,0,0,0.55)]">
          Access Islamic Knowledge and Resources
        </p>
        <div className="mt-6 md:mt-8 px-2">
          <SearchBarLive placeholder="Search books, lectures, duas..." />
        </div>
      </section>

      {/* Dua slideshow */}
      <div className="mx-auto px-4 sm:px-8 md:px-12 mt-6 mb-10 md:mb-14">
        <DuaSlideshow />
      </div>

      {/* Continue Reading */}
      <RecentlyRead />

      {/* Section cards */}
      <section className="max-w-[1300px] mx-auto px-5 pb-20">
        <div className="flex flex-wrap justify-center gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group basis-[calc(50%-0.75rem)] sm:basis-[calc(33.333%-1rem)] md:basis-[calc(20%-1.2rem)] bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 text-center"
            >
              <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-teal-50 mb-4">
                <Image
                  src={section.image}
                  alt={section.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="block text-lg md:text-xl font-bold text-teal-900">
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
