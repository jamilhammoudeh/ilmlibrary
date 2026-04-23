"use client";

import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import { useState, useRef } from "react";
import { Send, Share2, Link2, Check } from "lucide-react";
import emailjs from "@emailjs/browser";
import { SITE_URL } from "@/lib/site";

const principles = [
  {
    number: "01",
    title: "Rooted in authenticity",
    body: "Every page traces back to the Qur'an and the authentic Sunnah, understood through the way of the Salaf as-Salih.",
  },
  {
    number: "02",
    title: "Made to be read",
    body: "Typography, spacing, and navigation obsessed over, so reading feels effortless on any device.",
  },
  {
    number: "03",
    title: "Free as sadaqah",
    body: "No paywalls, no advertising, no accounts. Built so that whoever benefits becomes a cause of ongoing reward.",
  },
];

const sections = [
  { href: "/quran", label: "Qur'an" },
  { href: "/duas", label: "Supplications" },
  { href: "/books", label: "Books" },
  { href: "/lectures", label: "Lectures" },
  { href: "/khutbas", label: "Khutbas" },
  { href: "/guides", label: "Study guides" },
  { href: "/wisdom", label: "Reflections" },
];

export default function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [linkCopied, setLinkCopied] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleShare() {
    const shareData = {
      title: "Ilm Library",
      text: "A quiet library for the seeker of Islamic knowledge.",
      url: SITE_URL,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }

  async function handleCopyLink() {
    if (typeof window === "undefined") return;
    const url = SITE_URL;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      const ok = window.prompt("Copy this link:", url);
      if (ok !== null) {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(
        "service_7losx0f",
        "template_35viseg",
        formRef.current!,
        "0iYM6Hgwgu4LeGLtY"
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <ContentHeader title="About" breadcrumbs={[{ label: "About" }]} />

      {/* Hero, side-by-side Arabic + mission */}
      <section className="w-[92%] max-w-7xl mx-auto mt-8 md:mt-10 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Arabic anchor */}
          <div className="md:col-span-5 text-center md:text-right md:border-r md:border-teal-900/10 md:pr-12">
            <p
              className="font-[family-name:var(--font-amiri)] text-teal-900 text-[28px] sm:text-[32px] md:text-[38px] leading-[1.7]"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-teal-700 font-semibold mt-3">
              In the name of Allah
            </p>
          </div>

          {/* Mission */}
          <div className="md:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-teal-700 font-semibold mb-3">
              Ilm Library
            </p>
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] leading-[1.15] font-bold font-[family-name:var(--font-playfair)] text-teal-900 mb-4">
              A quiet library for the seeker of knowledge.
            </h2>
            <p className="text-gray-700 text-[15px] md:text-[16px] leading-[1.7]">
              A home for Islamic knowledge that stays faithful to its sources,
              reads beautifully, and welcomes anyone. A verse remembered, a dua
              recited, a book opened late at night. May each one leave a trace
              of light.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-[92%] max-w-7xl mx-auto mt-12 md:mt-14">
        <hr className="border-t border-teal-900/10" />
      </div>

      {/* Principles, 3 columns side-by-side */}
      <section className="w-[92%] max-w-7xl mx-auto py-12 md:py-14 fade-in-up">
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-teal-700 font-semibold">
            How we work
          </p>
          <p className="text-xs text-gray-400 italic hidden sm:block">
            Three ideas, always.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {principles.map(({ number, title, body }) => (
            <li key={number} className="md:border-l md:border-teal-900/10 md:pl-6">
              <span className="font-[family-name:var(--font-playfair)] text-[40px] md:text-[44px] leading-none text-teal-900/25 font-bold tabular-nums block mb-3">
                {number}
              </span>
              <h3 className="text-[18px] md:text-[19px] font-bold text-teal-900 mb-2 font-[family-name:var(--font-playfair)]">
                {title}
              </h3>
              <p className="text-gray-700 leading-[1.65] text-[14.5px]">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Divider */}
      <div className="w-[92%] max-w-7xl mx-auto">
        <hr className="border-t border-teal-900/10" />
      </div>

      {/* Two-column: intention story + inside the library */}
      <section className="w-[92%] max-w-7xl mx-auto py-12 md:py-14 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          {/* Intention */}
          <div className="md:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-teal-700 font-semibold mb-4">
              The intention
            </p>
            <p className="text-gray-800 leading-[1.8] text-[15.5px] first-letter:font-[family-name:var(--font-playfair)] first-letter:text-[56px] first-letter:font-bold first-letter:text-teal-900 first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1">
              Most of the internet is not built for reflection. Feeds chase
              attention and ad impressions, not the slow work of learning a
              tradition that is fourteen centuries deep. This library is a
              small answer. No trackers, no popups, no algorithm deciding what
              you read tonight. Just a page, a verse, a chain of narration, a
              word from a scholar who spent a lifetime preserving it.
            </p>
          </div>

          {/* Inside the library */}
          <div className="md:col-span-5 md:border-l md:border-teal-900/10 md:pl-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-teal-700 font-semibold mb-4">
              Inside the library
            </p>
            <ul className="space-y-2.5">
              {sections.map((s, i) => (
                <li
                  key={s.href}
                  className="flex items-baseline gap-3 text-[15px]"
                >
                  <span className="text-teal-700/40 font-mono text-xs tabular-nums pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={s.href}
                    className="text-teal-900 font-medium hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700/40"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-[92%] max-w-7xl mx-auto">
        <hr className="border-t border-teal-900/10" />
      </div>

      {/* One small request, two columns */}
      <section className="w-[92%] max-w-7xl mx-auto py-12 md:py-14 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-teal-700 font-semibold mb-4">
              One small request
            </p>
            <h2 className="text-[26px] md:text-[32px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-[1.15]">
              If this site ever benefits you, let us both benefit from it.
            </h2>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="md:border-l md:border-teal-900/10 md:pl-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-teal-700/70 font-semibold mb-2">
                Make dua
              </p>
              <p className="text-gray-700 text-[14.5px] leading-[1.7]">
                A quiet dua for the people who built this, and for anyone else
                who reads a single verse here tonight. That is the only payment
                we ask.
              </p>
            </div>
            <div className="md:pl-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-teal-700/70 font-semibold mb-2">
                Share it
              </p>
              <p className="text-gray-700 text-[14.5px] leading-[1.7] mb-4">
                Send it to a friend, a sibling, a study group. Every person who
                benefits becomes a trace of reward for all of us.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-teal-900 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,77,64,0.2)]"
                >
                  <Share2 size={14} />
                  Share
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-900 text-sm font-medium px-4 py-2 rounded-full border border-teal-900/15 transition-all duration-200"
                >
                  {linkCopied ? <Check size={14} /> : <Link2 size={14} />}
                  {linkCopied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-[92%] max-w-7xl mx-auto">
        <hr className="border-t border-teal-900/10" />
      </div>

      {/* Contact: two columns, info + form */}
      <section className="w-[92%] max-w-7xl mx-auto py-12 md:py-14 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-teal-700 font-semibold mb-4">
              Write to us
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold font-[family-name:var(--font-playfair)] text-teal-900 leading-tight mb-3">
              A note, a correction, a suggestion.
            </h2>
            <p className="text-gray-600 text-[14.5px] leading-[1.65]">
              Spotted a mistake in a reference or translation? Please tell us.
              The work is better for it.
            </p>
          </div>

          <div className="md:col-span-8">
            {status === "sent" ? (
              <div className="py-10 border-t border-b border-teal-900/10 text-center">
                <p className="text-green-accent font-semibold text-lg mb-1">
                  Your message is on its way.
                </p>
                <p className="text-gray-500 text-sm">
                  We will reply soon, in sha Allah.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="from_name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-[15px] text-gray-900 focus:outline-none focus:border-teal-700 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="reply_to"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-[15px] text-gray-900 focus:outline-none focus:border-teal-700 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-[15px] text-gray-900 focus:outline-none focus:border-teal-700 resize-none transition-colors"
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-500 text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,77,64,0.25)]"
                  >
                    <Send size={14} />
                    {status === "sending" ? "Sending" : "Send message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Closing dua */}
      <section className="w-[92%] max-w-4xl mx-auto text-center pb-16 md:pb-20 pt-8 fade-in-up">
        <div className="relative">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 bg-teal-900/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-teal-700 font-semibold">
              A closing dua
            </span>
            <span className="h-px w-12 bg-teal-900/15" />
          </div>

          <p
            className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] sm:text-[26px] md:text-[30px] leading-[1.9] mb-4"
            dir="rtl"
          >
            رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ
          </p>
          <p className="italic text-gray-600 text-[14.5px] max-w-md mx-auto leading-relaxed">
            Our Lord, accept this from us. Truly You are the All Hearing, the All Knowing.
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-teal-700/70 font-semibold mt-4">
            Qur&apos;an 2:127
          </p>
        </div>
      </section>
    </>
  );
}
