import Link from "next/link";
import { redirect } from "next/navigation";
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/seo";
import { LIVE_RESULTS_ENABLED } from "@/lib/feature-flags";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Election Results – Live Updates",
  description: "Election results and live election results: Texas primaries, Texas election results today, primary results, and election tracker. Real-time vote counts.",
  openGraph: {
    title: "Election Results – Live Updates | US Election Tracker",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  alternates: { canonical: SITE_URL },
};

/**
 * When live results are enabled, default (/) redirects to /live-results.
 * Otherwise, server-rendered home with links to Live Results, Notable Races, State of the Nation.
 */
export default function Home() {
  if (LIVE_RESULTS_ENABLED) {
    redirect("/live-results");
  }
  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Election Results – Live Updates
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Track <strong>election results</strong> and <strong>election live results</strong> in one place.
        Follow <strong>Texas primaries</strong>, <strong>Texas election results today</strong>, and
        live primary results for U.S. Senate and governor races. {SITE_NAME} is your
        <strong> election tracker</strong> for real-time vote counts and race calls.
      </p>
      <nav className="flex flex-col gap-3 sm:gap-4" aria-label="Main sections">
        <Link
          href="/live-results"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="text-red-500 font-semibold mr-2">Live</span>
          Live Election Results – Texas primaries and today&apos;s races
        </Link>
        <Link
          href="/notable-races"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Notable Races – Primary results by state (Senate & governor)
        </Link>
        <Link
          href="/state-of-nation"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          State of the Nation – Electoral map and election results by state
        </Link>
      </nav>
      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/faq" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Election results FAQ
        </Link>
        {" · "}
        <Link href="/election/texas" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Texas election results
        </Link>
      </p>
    </div>
  );
}
