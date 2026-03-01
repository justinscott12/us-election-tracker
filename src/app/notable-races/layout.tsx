import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Notable Races – Senate & Governor Primary Results",
  description:
    "Track notable US election races: Senate primaries, governor primaries, and key House races. Live results, candidates, and race summaries.",
  openGraph: {
    title: "Notable Races – Senate & Governor Primary Results | US Election Tracker",
    description:
      "Track notable US election races: Senate primaries, governor primaries, and key House races. Live results and race summaries.",
    url: `${SITE_URL}/notable-races`,
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
