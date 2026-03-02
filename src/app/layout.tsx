import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Live Election Results & Tracker`,
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
    title: `${SITE_NAME} – Live Election Results & Tracker`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – Live Election Results & Tracker`,
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
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", url: `${SITE_URL}/notable-races` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: "Live US election results tracker: presidential, Senate, House, and governor races.",
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
        </footer>
      </body>
    </html>
  );
}
