import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { supabase } from "@/lib/supabase";

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("content_type", "khutba")
    .order("name");
  return data ?? [];
}

export const metadata = {
  title: "Khutbas",
  description: "Access a variety of khutbah collections",
};

export default async function KhutbasPage() {
  const categories = await getCategories();

  return (
    <>
      <ContentHeader
        title="Access a Variety of Khutbah Collections" breadcrumbs={[{ label: "Khutbas" }]}
        subtitle="A Collection of Khutbahs Organized into Categories"
      />

      {/* Description card */}
      <section className="w-[92%] mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            Welcome to the Khutbah section. This section provides access to a
            collection of khutbahs delivered by different Imams. Each category
            offers distinct insights and teachings.
          </p>
        </div>
      </section>

      <section className="py-10 pb-32 md:pb-36 px-5">
        <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto fade-in-up">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/khutbas/${cat.slug}`}
              className="group w-[calc(50%-0.5rem)] sm:w-[230px] h-[58px] bg-white rounded-2xl flex items-center justify-center text-center font-[family-name:var(--font-roboto)] text-[17px] font-bold text-teal-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <span className="group-hover:text-teal-700 transition-colors duration-200 px-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
