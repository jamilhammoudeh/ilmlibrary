import Link from "next/link";
import { BookOpen, Store, BarChart3, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Sponsor Ilm Library",
  description:
    "Put your book, publishing house, or halal business in front of thousands of Muslim readers.",
};

const offerings = [
  {
    icon: Store,
    title: "Business Sponsorship",
    text: "Your halal business featured on the homepage with your logo, name, and a one-line message — seen by every visitor to the library.",
  },
  {
    icon: BookOpen,
    title: "Sponsor a Book",
    text: "Publishing a book? Feature it in the library with a purchase link so readers can buy your print edition directly.",
  },
  {
    icon: BarChart3,
    title: "Real numbers",
    text: "Every sponsored placement is click-tracked. You get honest numbers on how many readers visited you — no guesswork.",
  },
  {
    icon: ShieldCheck,
    title: "Halal only",
    text: "We only accept sponsors whose products and earnings are permissible. No riba-based finance, no haram products, no exceptions.",
  },
];

export default function SponsorPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">
      <div className="text-center mb-10">
        <p
          className="text-[22px] md:text-[26px] font-[family-name:var(--font-amiri)] text-teal-700 leading-none mb-2"
          lang="ar"
          dir="rtl"
        >
          ادعم نشر العلم
        </p>
        <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-teal-900 mb-4">
          Sponsor Ilm Library
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Put your book, publishing house, or halal business in front of a
          growing community of Muslim readers — and support free access to
          Islamic knowledge at the same time.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {offerings.map((o) => (
          <div key={o.title} className="bg-white rounded-2xl p-6 card-shadow">
            <o.icon className="text-teal-700 mb-3" size={24} />
            <h2 className="text-lg font-bold text-teal-900 mb-1.5">{o.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{o.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-teal-900 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-2">
          Interested?
        </h2>
        <p className="text-teal-100 mb-5 max-w-md mx-auto">
          Tell us about your book or business and we&apos;ll get back to you
          with placement options and pricing.
        </p>
        <a
          href="mailto:support@ilmlibrary.org?subject=Sponsoring%20Ilm%20Library"
          className="inline-block bg-white text-teal-900 font-semibold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors"
        >
          Email us
        </a>
        <p className="text-xs text-teal-100/70 mt-4">
          Prefer to support without sponsoring?{" "}
          <Link href="/donate" className="underline hover:text-white">
            Make a donation
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
