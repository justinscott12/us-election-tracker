import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, LIVE_RESULTS_PHRASES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Live Election Results – Texas Primaries, Election Today & Real-Time Vote Results",
  description:
    "Live election results and election live results: Texas primaries, Texas election results today, primary results, vote results. Real-time election results and election night results as polls close.",
  keywords: [...LIVE_RESULTS_PHRASES],
  openGraph: {
    title: "Live Election Results – Texas Primaries & Election Today | " + SITE_NAME,
    description:
      "Live election results and Texas election results today. Texas primaries, election live results, primary results, real-time vote results.",
    url: `${SITE_URL}/live-results`,
    images: [{ url: "/live-results/opengraph-image", alt: "Live election results – Texas primaries, election today, election results, vote results" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Election Results – Texas Primaries & Election Today | " + SITE_NAME,
    description: "Live election results and Texas election results today. Texas primaries, election live, vote results.",
  },
  alternates: { canonical: `${SITE_URL}/live-results` },
};

export default function LiveResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LiveResultsJsonLd />
      {children}
    </>
  );
}

/** WebPage + ItemList JSON-LD for live-results page (rich results, sitelinks). */
function LiveResultsJsonLd() {
  const pageUrl = `${SITE_URL}/live-results`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Live Election Results – Texas Primaries, Election Today & Real-Time Vote Results",
        description:
          "Live election results and election live results: Texas primaries, Texas election results today, primary results, vote results. Real-time election results and election night results.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: "Live election results, Texas primaries, Texas election results today, primary results, vote results, election night results",
      },
      {
        "@type": "ItemList",
        name: "Election results – races today",
        description: "Live election results and primary results for races happening today. Texas primaries, vote results.",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Texas U.S. Senate Republican Primary",
            url: pageUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Texas U.S. Senate Democratic Primary",
            url: pageUrl,
          },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
