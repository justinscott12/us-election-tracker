import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Live Results – Today's Election Results",
  description:
    "Live election results for today's races. Real-time primary and election night results, vote counts, and race calls.",
  openGraph: {
    title: "Live Election Results – Today's Races | US Election Tracker",
    description:
      "Live election results for today's races. Real-time primary and election night results.",
    url: `${SITE_URL}/live-results`,
  },
  alternates: { canonical: `${SITE_URL}/live-results` },
};

export default function LiveResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
