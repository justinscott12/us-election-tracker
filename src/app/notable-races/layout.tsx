import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, NOTABLE_RACES_PHRASES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Notable Races – Primary Results, Senate & Governor Election Results",
  description:
    "Notable races and primary results: Texas primaries, senate primary results, governor primary results. Election results, live primary results, and election tracker for US Senate race and governor race.",
  keywords: [...NOTABLE_RACES_PHRASES],
  openGraph: {
    title: "Notable Races – Primary Results & Senate Election Results | " + SITE_NAME,
    description:
      "Track notable races, primary results, Texas primaries, Senate and governor primary results. Election results and live primary results by state.",
    url: `${SITE_URL}/notable-races`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Notable Races – Primary Results & Senate | " + SITE_NAME,
    description: "Notable races, primary results, Texas primaries, Senate and governor primary results. Election tracker.",
  },
  alternates: { canonical: `${SITE_URL}/notable-races` },
};

export default function NotableRacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
