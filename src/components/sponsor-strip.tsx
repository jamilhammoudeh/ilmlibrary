import Image from "next/image";
import Link from "next/link";
import { getActiveSponsors } from "@/lib/queries";

// Tasteful sponsor placements: small clearly-labeled cards, no ad-network
// junk. Links route through /api/out so every click is counted. Renders
// nothing when there are no active sponsors.

export async function SponsorStrip({
  placement = "homepage",
}: {
  placement?: "homepage" | "books";
}) {
  const sponsors = await getActiveSponsors(placement, 3);
  if (sponsors.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-5">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
        Sponsors
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {sponsors.map((s) => (
          <a
            key={s.id}
            href={`/api/out?type=sponsor&id=${s.id}`}
            target="_blank"
            rel="sponsored noopener"
            className="group flex items-center gap-3 bg-white rounded-2xl px-5 py-4 card-shadow hover:-translate-y-0.5 transition-all duration-200 min-w-[240px] max-w-[340px]"
          >
            {s.image_url ? (
              <span className="relative w-11 h-11 rounded-lg overflow-hidden bg-teal-50 shrink-0">
                <Image src={s.image_url} alt={s.name} fill sizes="44px" className="object-cover" />
              </span>
            ) : (
              <span className="w-11 h-11 rounded-lg bg-teal-50 text-teal-800 font-bold text-lg flex items-center justify-center shrink-0">
                {s.name.slice(0, 1)}
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-sm font-bold text-teal-900 group-hover:text-teal-700 transition-colors truncate">
                {s.name}
              </span>
              {s.tagline && (
                <span className="block text-xs text-gray-500 line-clamp-2">{s.tagline}</span>
              )}
            </span>
          </a>
        ))}
      </div>
      <p className="text-center mt-4">
        <Link
          href="/sponsor"
          className="text-xs text-gray-400 hover:text-teal-700 transition-colors"
        >
          Sponsor your book or halal business →
        </Link>
      </p>
    </section>
  );
}
