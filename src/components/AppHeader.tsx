"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import statePathsData from "@/data/state-paths.json";

const STATE_PATHS = statePathsData as { id: string; d: string }[];

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 600"
      width={32}
      height={32}
      className="shrink-0 text-slate-900 dark:text-white"
      aria-hidden
    >
      <g fill="currentColor" stroke="none">
        {STATE_PATHS.filter((s) => s.id !== "DC").map(({ id, d }) => (
          <path key={id} d={d} strokeLinejoin="round" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [defaultHomeHref, setDefaultHomeHref] = useState<string>("/notable-races");
  const [showLiveResults, setShowLiveResults] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    fetch("/api/election", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { showLiveResults?: boolean } | null) => {
        const enabled = !!data?.showLiveResults;
        setShowLiveResults(enabled);
        setDefaultHomeHref(enabled ? "/live-results" : "/notable-races");
      })
      .catch(() => {
        setShowLiveResults(false);
        setDefaultHomeHref("/notable-races");
      });
  }, []);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  const linkClass =
    "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors";
  const activeClass = "text-slate-900 dark:text-white";

  return (
    <header className="relative border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 pl-0 pr-4 py-3 shrink-0 sm:pl-2">
      <div className="relative max-w-4xl mx-auto flex items-center justify-between gap-4">
        <nav className="flex items-center gap-2 sm:gap-3 text-sm font-medium min-w-0 shrink-0 max-w-[38%] justify-start">
          {showLiveResults && (
            <Link
              href="/live-results"
              className={`shrink-0 flex items-center gap-1.5 ${pathname === "/live-results" ? activeClass : linkClass}`}
            >
              <span
                className="live-dot size-2 shrink-0 rounded-full bg-red-500"
                aria-hidden
              />
              Live Results
            </Link>
          )}
          <Link
            href="/notable-races"
            className={`shrink-0 ${pathname === "/notable-races" ? activeClass : linkClass}`}
          >
            Notable Races
          </Link>
          <Link
            href="/state-of-nation"
            className={`min-w-0 truncate ${pathname === "/state-of-nation" ? activeClass : linkClass}`}
          >
            State of the Nation
          </Link>
        </nav>
        <Link
          href={defaultHomeHref}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-xl font-bold hover:opacity-90 py-2 ${pathname === "/" || pathname === defaultHomeHref ? activeClass : "text-slate-900 dark:text-white"}`}
        >
          <LogoIcon />
          US Election Tracker
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
