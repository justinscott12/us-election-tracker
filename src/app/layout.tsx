import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Election Results – Live Election Results & Election Tracker | US Election Tracker",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Election Results – Live Election Results & Election Tracker | US Election Tracker",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: "US Election Tracker – Election results, live election results, Texas primaries, electoral map, election tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Election Results – Live Election Results & Election Tracker | US Election Tracker",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
  icons: { icon: "/favicon.svg" },
  category: "news",
};

const THEME_SCRIPT = `
(function() {
  var theme = localStorage.getItem('theme');
  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
      potentialAction: [
        {
          "@type": "ViewAction",
          target: { "@type": "EntryPoint", url: `${SITE_URL}/live-results` },
          name: "View live election results",
        },
        {
          "@type": "ViewAction",
          target: { "@type": "EntryPoint", url: `${SITE_URL}/notable-races` },
          name: "View notable races and primary results",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: "Election results and election tracker: live election results, Texas primaries, Texas election results today, electoral map, Senate and governor races. Track election results and vote results.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Live Election Results", item: `${SITE_URL}/live-results` },
        { "@type": "ListItem", position: 3, name: "Notable Races", item: `${SITE_URL}/notable-races` },
        { "@type": "ListItem", position: 4, name: "State of the Nation", item: `${SITE_URL}/state-of-nation` },
      ],
    },
    {
      "@type": "Event",
      name: "Texas U.S. Senate Primaries 2026",
      description: "Texas primary election – Republican and Democratic U.S. Senate primaries. Live election results, Texas election results today, Texas primaries, vote results, and primary results.",
      startDate: "2026-03-03T19:00:00-06:00",
      endDate: "2026-03-04T00:00:00-06:00",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: "Texas" },
      url: `${SITE_URL}/live-results`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <GoogleAnalytics />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <AppHeader />
        <main className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
          © 2026 Sunshine Tech Solutions LLC. All rights reserved.
          {" · "}
          <Link href="/live-results" className="underline hover:text-slate-700 dark:hover:text-slate-300">Live election results</Link>
          {" · "}
          <Link href="/notable-races" className="underline hover:text-slate-700 dark:hover:text-slate-300">Notable races</Link>
          {" · "}
          <Link href="/state-of-nation" className="underline hover:text-slate-700 dark:hover:text-slate-300">State of the Nation</Link>
          {" · "}
          <Link href="/faq" className="underline hover:text-slate-700 dark:hover:text-slate-300">Election results FAQ</Link>
          {" · "}
          <Link href="/election/texas" className="underline hover:text-slate-700 dark:hover:text-slate-300">Texas election results</Link>
        </footer>
      </body>
    </html>
  );
}
