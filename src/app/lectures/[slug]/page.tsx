import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Mic } from "lucide-react";
import { ContentHeader } from "@/components/content-header";
import { supabase } from "@/lib/supabase";

async function getCategory(slug: string) {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("content_type", "lecture")
    .single();
  return data;
}

async function getLectures(categoryId: string) {
  const { data } = await supabase
    .from("lectures")
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
  return { title: category?.name ?? "Lectures" };
}

export default async function LectureCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const lectures = await getLectures(category.id);

  return (
    <>
      <ContentHeader title={category.name} subtitle={category.description ?? undefined} breadcrumbs={[{ label: "Lectures", href: "/lectures" }, { label: category.name }]} />

      <section className="py-10 pb-32 md:pb-36 px-5">
        {lectures.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-16 fade-in-up">
            <Mic size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No lectures yet</p>
            <p className="text-sm text-gray-400">
              Content coming soon. Lectures for this collection are being prepared.
            </p>
          </div>
        ) : (
        <div className="max-w-7xl mx-auto space-y-4 fade-in-up">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="font-semibold text-teal-900 group-hover:text-teal-700 transition-colors duration-200">
                {lecture.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{lecture.speaker}</p>
              {lecture.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {lecture.description}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                {lecture.audio_url && (
                  <a
                    href={lecture.audio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-900 font-medium transition-colors duration-200"
                  >
                    <Play size={14} /> Listen
                  </a>
                )}
                {lecture.video_url && (
                  <a
                    href={lecture.video_url}
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
