import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const { data: books } = await supabase
    .from("books")
    .select("title, slug, author, description, created_at, categories(slug)")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (books ?? [])
    .map((b: any) => {
      const url = `${SITE_URL}/books/${b.categories?.slug ?? "uncategorized"}/${b.slug}`;
      return `    <item>
      <title><![CDATA[${b.title}]]></title>
      <link>${url}</link>
      <description><![CDATA[${b.description ?? `${b.title} by ${b.author}`}]]></description>
      <pubDate>${new Date(b.created_at).toUTCString()}</pubDate>
      <guid>${url}</guid>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ilm Library</title>
    <link>${SITE_URL}</link>
    <description>Access Islamic Knowledge and Resources</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
