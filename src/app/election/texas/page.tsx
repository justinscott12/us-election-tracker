import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, TEXAS_PAGE_PHRASES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Texas Election Results – Texas Primaries, Texas Election Today & Live Results",
  description:
    "Texas election results and Texas primaries: Texas election today, Texas primary results, Texas senate race. Live election results, Texas vote results, Texas polls close times.",
  keywords: [...TEXAS_PAGE_PHRASES],
  openGraph: {
    title: "Texas Election Results – Texas Primaries & Texas Election Today | " + SITE_NAME,
    description: "Texas election results, Texas primaries, Texas election today. Texas primary results, Texas senate race, live election results.",
    url: `${SITE_URL}/election/texas`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Texas Election Results – Texas Primaries | " + SITE_NAME,
    description: "Texas election results, Texas primaries, Texas election today, Texas primary results, live election results.",
  },
  alternates: { canonical: `${SITE_URL}/election/texas` },
};

export default function TexasElectionPage() {
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Texas Election Results – Texas Primaries & Live Results
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Track <strong>Texas election results</strong> and <strong>Texas primaries</strong> in one place.
        See <strong>Texas election results today</strong> and <strong>live election results</strong> for
        U.S. Senate and governor primaries. <strong>Texas polls close</strong> at 7:00 PM Central Time on primary election day;
        <strong> Texas vote results</strong> and <strong>Texas primary results</strong> update as counties report.
      </p>
      <nav className="flex flex-col gap-3">
        <Link
          href="/live-results"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Live Election Results – Texas primaries and today&apos;s races
        </Link>
        <Link
          href="/notable-races"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          All notable races and primary results
        </Link>
      </nav>
      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/faq" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Election results FAQ – when do Texas polls close?
        </Link>
      </p>
    </div>
  );
}
