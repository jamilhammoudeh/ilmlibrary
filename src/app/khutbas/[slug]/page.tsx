import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, BookMarked } from "lucide-react";
import { ContentHeader } from "@/components/content-header";
import { supabase } from "@/lib/supabase";

async function getCategory(slug: string) {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("content_type", "khutba")
    .single();
  return data;
}

async function getKhutbas(categoryId: string) {
  const { data } = await supabase
    .from("khutbas")
    .select("*")
    .eq("category_id", categoryId)
    .order("title");
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? "Khutbas" };
}

export default async function KhutbaCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const khutbas = await getKhutbas(category.id);

  return (
    <>
      <ContentHeader title={category.name} subtitle={category.description ?? undefined} breadcrumbs={[{ label: "Khutbas", href: "/khutbas" }, { label: category.name }]} />

      <section className="py-10 pb-32 md:pb-36 px-5">
        {khutbas.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-16 fade-in-up">
            <BookMarked size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No khutbas yet</p>
            <p className="text-sm text-gray-400">
              Content coming soon. Khutbas for this collection are being prepared.
            </p>
          </div>
        ) : (
        <div className="space-y-4 fade-in-up">
          {khutbas.map((khutba) => (
            <div
              key={khutba.id}
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="font-semibold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                {khutba.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{khutba.speaker}</p>
              {khutba.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {khutba.description}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                {khutba.audio_url && (
                  <a
                    href={khutba.audio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-900 font-medium transition-colors duration-200"
                  >
                    <Play size={14} /> Listen
                  </a>
                )}
                {khutba.video_url && (
                  <a
                    href={khutba.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-900 font-medium transition-colors duration-200"
                  >
                    <Play size={14} /> Watch
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </section>
    </>
  );
}
