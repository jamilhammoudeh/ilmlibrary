import type { Metadata } from "next";
import { Roboto, Amiri, Lora, Playfair_Display, Scheherazade_New } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MainWrapper } from "@/components/main-wrapper";
import { ScrollToTop } from "@/components/scroll-to-top";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { PageViewTracker } from "@/components/page-view-tracker";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ilmlibrary.org"),
  title: {
    default: "Ilm Library",
    template: "%s | Ilm Library",
  },
  description: "Access Islamic Knowledge and Resources",
  icons: {
    icon: [
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" }],
    shortcut: "/icon-192.png?v=2",
  },
  openGraph: {
    title: "Ilm Library",
    description: "Access Islamic Knowledge and Resources",
    url: "https://ilmlibrary.org",
    siteName: "Ilm Library",
    type: "website",
    images: [
      {
        url: "/icon-512.png?v=2",
        width: 512,
        height: 512,
        alt: "Ilm Library",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ilm Library",
    description: "Access Islamic Knowledge and Resources",
    images: ["/icon-512.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${amiri.variable} ${lora.variable} ${playfair.variable} ${scheherazade.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#004d40" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ilm Library",
              url: "https://ilmlibrary.org",
              logo: "https://ilmlibrary.org/icon-512.png?v=2",
              description: "Access Islamic Knowledge and Resources",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ilm Library",
              url: "https://ilmlibrary.org",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://ilmlibrary.org/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
        <ScrollToTop />
        <KeyboardShortcuts />
        <PageViewTracker />
        <Analytics />
      </body>
    </html>
  );
}
