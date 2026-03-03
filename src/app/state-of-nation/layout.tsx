import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, STATE_OF_NATION_PHRASES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "State of the Nation – Electoral Map, Election Results by State & Congress Results",
  description:
    "State of the nation: electoral map, election results by state, election map. Congress results, Senate results, House results. Live election results and presidential election results.",
  keywords: [...STATE_OF_NATION_PHRASES],
  openGraph: {
    title: "State of the Nation – Electoral Map & Election Results by State | " + SITE_NAME,
    description:
      "Electoral map and election results by state. Congress results, Senate and House results. US election map and state election results.",
    url: `${SITE_URL}/state-of-nation`,
  },
  twitter: {
    card: "summary_large_image",
    title: "State of the Nation – Electoral Map | " + SITE_NAME,
    description: "Electoral map, election results by state, Congress results. Election map and state election results.",
  },
  alternates: { canonical: `${SITE_URL}/state-of-nation` },
};

export default function StateOfNationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
