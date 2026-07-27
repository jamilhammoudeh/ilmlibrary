import { getDb, getEnv } from "@/lib/db";
import { newId } from "@/lib/d1-helpers";

// Contact form: store in D1 first (nothing is ever lost), then email a
// notification via Cloudflare Email Sending. Email failure never fails the
// request — the message is already saved and visible in the admin panel.

export const dynamic = "force-dynamic";

const NOTIFY_TO = "contactilmlibrary@gmail.com";
const FROM = { email: "contact@ilmlibrary.org", name: "Ilm Library Contact" };

type EmailBinding = {
  send(opts: {
    to: string;
    from: { email: string; name?: string };
    replyTo?: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<unknown>;
};

const cap = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
    website?: string; // honeypot — real users never fill this
  } | null;

  if (body?.website) return Response.json({ ok: true }); // silently drop bots

  const name = cap(body?.name, 120);
  const email = cap(body?.email, 200);
  const message = cap(body?.message, 5000);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  const db = await getDb();

  // Light rate limit: max 5 stored messages per 10 minutes globally.
  const recent = await db
    .prepare("SELECT COUNT(*) AS n FROM contact_messages WHERE created_at >= datetime('now','-10 minutes')")
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= 5) {
    return Response.json({ error: "Too many messages right now — try again shortly." }, { status: 429 });
  }

  await db
    .prepare("INSERT INTO contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)")
    .bind(newId(), name, email, message)
    .run();

  // Best-effort notification email.
  try {
    const env = await getEnv();
    const emailBinding = (env as unknown as { EMAIL?: EmailBinding }).EMAIL;
    if (emailBinding) {
      await emailBinding.send({
        to: NOTIFY_TO,
        from: FROM,
        replyTo: email,
        subject: `Ilm Library contact: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}\n\n—\nReply directly to this email to answer them.\nAll messages are also saved at www.ilmlibrary.org/admin/messages`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr><p style="color:#666;font-size:12px">Reply directly to this email to answer them. All messages are also saved in the <a href="https://www.ilmlibrary.org/admin/messages">admin panel</a>.</p>`,
      });
    }
  } catch (e) {
    console.error("contact email notification failed:", e instanceof Error ? e.message : e);
  }

  return Response.json({ ok: true });
}
