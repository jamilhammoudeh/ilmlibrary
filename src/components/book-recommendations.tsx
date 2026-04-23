import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export async function BookRecommendations({
  currentBookId,
  categoryId,
  categorySlug,
}: {
  currentBookId: string;
  categoryId: string | null;
  categorySlug: string;
}) {
  if (!categoryId) return null;

  const { data } = await supabase
    .from("books")
    .select("id, title, slug, cover_url, author")
    .eq("category_id", categoryId)
    .neq("id", currentBookId)
    .order("display_order")
    .limit(4);

  if (!data || data.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-5 pb-20 md:pb-24">
      <h2 className="text-lg font-bold text-teal-900 mb-4">You Might Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((book) => (
          <Link
            key={book.id}
            href={`/books/${categorySlug}/${book.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
          >
            <div className="relative aspect-[2/3] bg-teal-50 overflow-hidden">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                  {book.title}
                </div>
              )}
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-semibold text-teal-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
                {book.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
