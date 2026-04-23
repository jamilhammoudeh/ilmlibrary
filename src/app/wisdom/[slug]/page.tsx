import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { ContentHeader } from "@/components/content-header";
import { LightboxImage } from "@/components/image-lightbox";
import { supabase } from "@/lib/supabase";

function isImageUrl(url: string) {
  return url.match(/\.(png|jpg|jpeg|webp)$/i) || url.includes("/wisdom-images/");
}

async function getCategory(slug: string) {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("content_type", "wisdom")
    .single();
  return data;
}

async function getWisdom(categoryId: string) {
  const { data } = await supabase
    .from("wisdom")
    .select("*")
    .eq("category_id", categoryId)
    .order("created_at");
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? "Wisdom" };
}

export default async function WisdomCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const quotes = await getWisdom(category.id);
  const hasImages = quotes.some((q) => q.source && isImageUrl(q.source));

  return (
    <>
      <ContentHeader title={category.name} breadcrumbs={[{ label: "Wisdom", href: "/wisdom" }, { label: category.name }]} />

      <section className="py-10 pb-32 md:pb-36 px-5">
        {quotes.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-16 fade-in-up">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No quotes yet</p>
            <p className="text-sm text-gray-400">
              Content coming soon. Wisdom quotes are being prepared for this scholar.
            </p>
          </div>
        ) : hasImages ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 fade-in-up">
            {quotes.map((q) =>
              q.source && isImageUrl(q.source) ? (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
                >
                  <LightboxImage
                    src={q.source}
                    alt={q.quote_english || category.name}
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              ) : null
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-4 fade-in-up">
            {quotes.map((q) => (
              <blockquote
                key={q.id}
                className="bg-white rounded-2xl p-6 border-l-4 border-teal-700 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                {q.quote_arabic && (
                  <p className="arabic-text text-xl text-gray-900 mb-3">
                    {q.quote_arabic}
                  </p>
                )}
                {q.quote_english && (
                  <p className="text-gray-700 leading-relaxed italic">
                    &ldquo;{q.quote_english}&rdquo;
                  </p>
                )}
                {q.source && !isImageUrl(q.source) && (
                  <footer className="text-sm text-gray-400 mt-2">
                    {q.source}
                  </footer>
                )}
              </blockquote>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
