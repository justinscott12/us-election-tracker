import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, FAQ_PHRASES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Election Results FAQ – When Are Results Available? When Do Polls Close?",
  description:
    "Election results FAQ: when are election results available, when do polls close, where to see election results. Live election results, Texas primaries, check election results, track election results.",
  keywords: [...FAQ_PHRASES],
  openGraph: {
    title: "Election Results FAQ – When Do Polls Close? | " + SITE_NAME,
    description: "When are election results available? When do polls close? Where to see live election results? Election results FAQ and election tracker.",
    url: `${SITE_URL}/faq`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Election Results FAQ | " + SITE_NAME,
    description: "Election results FAQ: when do polls close, where to see election results, live election results, Texas primaries.",
  },
  alternates: { canonical: `${SITE_URL}/faq` },
};

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "When are election results available?",
    a: "Election results and live election results start coming in after polls close. For Texas primaries, Texas polls close at 7:00 PM Central Time; Texas election results today update as counties report. Use our Live Election Results page to track election results in real time.",
  },
  {
    q: "Where can I see live election results?",
    a: "You can see live election results and election live results on US Election Tracker. We show Texas primaries, U.S. Senate and governor primary results, and real-time vote results. Use the Live Election Results page for races happening today.",
  },
  {
    q: "When do polls close?",
    a: "Texas polls close at 7:00 PM Central Time on primary and election days. When do polls close in other states? Check our Notable Races page for primary dates. After polls close, election results and vote results update as counties report.",
  },
  {
    q: "When are Texas primary election results available?",
    a: "Texas primary election results start coming in after Texas polls close at 7:00 PM Central Time on primary election day. Live election results are updated as counties report. You can see Texas election results today on our Live Results page.",
  },
  {
    q: "What is an election tracker?",
    a: "An election tracker is a tool to track election results, follow election results, and check election results in one place. Ours shows live election results, Texas primaries, Texas election results today, primary results, and vote results.",
  },
  {
    q: "Where can I find primary results?",
    a: "Primary results and election results are on our Notable Races page (all upcoming and recent primaries) and on Live Election Results when races are happening today. We include Texas primaries, Senate primary results, and governor primary results.",
  },
];

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <FaqJsonLd />
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Election Results FAQ
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Common questions about election results, live election results, Texas primaries, and our election tracker.
      </p>
      <dl className="space-y-6">
        {FAQ_ITEMS.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-semibold text-slate-900 dark:text-white mb-1">{q}</dt>
            <dd className="text-slate-600 dark:text-slate-300 pl-0 leading-relaxed">{a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/live-results" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          View live election results
        </Link>
        {" · "}
        <Link href="/election/texas" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Texas election results
        </Link>
      </p>
    </div>
  );
}
