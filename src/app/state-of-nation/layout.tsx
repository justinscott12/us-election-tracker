import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "State of the Nation – Electoral Map & Congress Results",
  description:
    "US election state of the nation: interactive electoral map, presidential results by state, Congress balance (Senate & House), and governor races.",
  openGraph: {
    title: "State of the Nation – Electoral Map & Congress | US Election Tracker",
    description:
      "Interactive US electoral map, presidential results by state, Senate and House balance, and governor races.",
    url: `${SITE_URL}/state-of-nation`,
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
