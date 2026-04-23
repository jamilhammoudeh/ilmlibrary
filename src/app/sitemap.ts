import { supabase } from "@/lib/supabase";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages = [
    "", "/books", "/quran", "/duas", "/lectures", "/khutbas",
    "/why-islam", "/why-islam/proving-islam", "/why-islam/defending-islam",
    "/why-islam/refutations", "/guides", "/wisdom", "/donate", "/about",
    "/quran/read", "/quran/reciters", "/quran/tajweed", "/quran/tafseer",
    "/quran/memorization", "/bookmarks",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Book categories
  const { data: bookCats } = await supabase
    .from("categories")
    .select("slug")
    .eq("content_type", "book");
  const catPages = (bookCats ?? []).map((c) => ({
    url: `${baseUrl}/books/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Individual books
  const { data: books } = await supabase
    .from("books")
    .select("slug, category_id, created_at, categories(slug)")
    .limit(2000);
  const bookPages = (books ?? []).map((b: any) => ({
    url: `${baseUrl}/books/${b.categories?.slug ?? "uncategorized"}/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Quran surahs
  const surahPages = Array.from({ length: 114 }, (_, i) => ({
    url: `${baseUrl}/quran/read/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  // Wisdom categories
  const { data: wisdomCats } = await supabase
    .from("categories")
    .select("slug")
    .eq("content_type", "wisdom");
  const wisdomPages = (wisdomCats ?? []).map((c) => ({
    url: `${baseUrl}/wisdom/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...catPages, ...bookPages, ...surahPages, ...wisdomPages];
}
