import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { supabase } from "@/lib/supabase";

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("content_type", "wisdom")
    .order("name");
  return data ?? [];
}

// Full roster of attribution pills, shown in this order regardless of DB state.
// `match` is a lowercased substring used to pair a DB attribution with its pill.
const KNOWN_ATTRIBUTIONS: Array<{
  display: React.ReactNode;
  slug: string;
  match: string;
}> = [
  {
    display: (
      <>
        Prophet Muhammad (
        <span className="font-[family-name:var(--font-amiri)] text-[22px] leading-none align-middle">
          &#xFDFA;
        </span>
        )
      </>
    ),
    slug: "prophet-muhammad",
    match: "prophet",
  },
  { display: "Shaykh Ibn Taymiyyah", slug: "ibn-taymiyyah", match: "ibn taymiyyah" },
  { display: "Shaykh Ibn Qayyim", slug: "ibn-qayyim", match: "ibn qayyim" },
  { display: "Shaykh Abd al-Wahhab", slug: "abd-al-wahhab", match: "abd al-wahhab" },
  { display: "Shaykh al-Albani", slug: "al-albani", match: "albani" },
  { display: "Shaykh Ibn Baz", slug: "ibn-baz", match: "ibn baz" },
  { display: "Shaykh Ibn Uthaymeen", slug: "ibn-uthaymeen", match: "uthaymeen" },
  { display: "Shaykh al-Fawzan", slug: "al-fawzan", match: "fawzan" },
  { display: "Shaykh Sa'di", slug: "sadi", match: "sa'di" },
  { display: "Shaykh ar-Ruhaili", slug: "ar-ruhaili", match: "ruhaili" },
  { display: "Imam al-Bukhari", slug: "al-bukhari", match: "bukhari" },
  { display: "Imam Muslim", slug: "muslim", match: "muslim" },
  { display: "Imam Abu Hanifa", slug: "abu-hanifa", match: "abu hanifa" },
  { display: "Imam Malik", slug: "malik", match: "malik" },
  { display: "Imam al-Shafi'i", slug: "al-shafii", match: "shafi" },
  { display: "Imam Ahmad ibn Hanbal", slug: "ahmad-ibn-hanbal", match: "ahmad" },
];

export const metadata = {
  title: "Wisdom",
  description: "Inspiring insights from the Prophet and scholars of the Salaf",
};

export default async function WisdomPage() {
  const categories = await getCategories();

  // Keep only categories matching a known scholar/imam in the roster,
  // then order them per the roster. This hides promotional "site section"
  // entries that got seeded under content_type=wisdom.
  const sorted = categories
    .filter((c) => KNOWN_ATTRIBUTIONS.some((k) => k.slug === c.slug))
    .sort((a, b) => {
      const ia = KNOWN_ATTRIBUTIONS.findIndex((k) => k.slug === a.slug);
      const ib = KNOWN_ATTRIBUTIONS.findIndex((k) => k.slug === b.slug);
      return ia - ib;
    });

  return (
    <>
      <ContentHeader
        title="Wisdom" breadcrumbs={[{ label: "Wisdom" }]}
        subtitle={`Inspiring insights from the Prophet \uFDFA and scholars of the Salaf`}
      />

      {/* Description card */}
      <section className="w-[92%] mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            A collection of profound hadiths from the Prophet Muhammad
            (&#xFDFA;) and insightful statements from notable Salafi scholars.
            These words offer timeless guidance and inspiration, reminding us
            of the path of truth and knowledge laid down by our predecessors.
          </p>
        </div>
      </section>

      {/* Category pills linking to individual pages */}
      <section className="py-10 px-5 pb-32 md:pb-36">
        <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto fade-in-up">
          {sorted.map((cat) => {
            const known = KNOWN_ATTRIBUTIONS.find((k) => k.slug === cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/wisdom/${cat.slug}`}
                className="group w-[calc(50%-0.5rem)] sm:w-[230px] h-[58px] bg-white rounded-2xl flex items-center justify-center text-center font-[family-name:var(--font-roboto)] text-[17px] font-bold text-teal-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <span className="group-hover:text-teal-700 transition-colors duration-200 px-2 flex items-baseline gap-1 justify-center">
                  {known?.display ?? cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
