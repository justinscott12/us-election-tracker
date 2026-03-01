"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Front page: redirect to Live Results when enabled, otherwise Notable Races.
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/election")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.showLiveResults) {
          router.replace("/live-results");
        } else {
          router.replace("/notable-races");
        }
      })
      .catch(() => router.replace("/notable-races"));
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <p className="text-slate-500 dark:text-slate-400">Loading…</p>
    </div>
  );
}
