"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import statePathsData from "@/data/state-paths.json";

const STATE_PATHS = statePathsData as { id: string; d: string }[];

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 600"
      className={`shrink-0 w-6 h-6 md:w-8 md:h-8 text-slate-900 dark:text-white ${className ?? ""}`}
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
    <header className="relative border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-3 py-3 shrink-0 lg:px-4">
      <div className="w-full flex flex-col gap-1 lg:gap-0 lg:block lg:relative">
        {/* Row 1: Below lg = two-row layout (Live left, theme+logo right). lg+ = single row with all nav. */}
        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
          {/* Left: below lg = Live Results link; lg+ = spacer for center nav */}
          <div className="flex items-center min-w-0 shrink lg:flex-1 lg:justify-end">
            <Link
              href="/live-results"
              className={`lg:hidden flex items-center gap-2.5 min-w-0 py-2 -my-2 ${pathname === "/live-results" ? activeClass : linkClass}`}
            >
              <span
                className="live-dot size-3 shrink-0 rounded-full bg-red-500 ring-2 ring-red-400/60 dark:ring-red-400/70 inline-block flex-none mr-0.5"
                aria-hidden
              />
              <span className="whitespace-nowrap truncate text-xs font-medium">Live Election Results</span>
            </Link>
          </div>
          {/* Center: nav tabs (visible from lg up); below lg hidden so row 2 shows Notable + State */}
          <nav className="flex items-center justify-center gap-2 lg:gap-5 text-xs lg:text-sm font-medium min-w-0 shrink">
            <Link
              href="/live-results"
              className={`flex items-center gap-2.5 py-2 -my-2 hidden lg:inline min-w-0 ${pathname === "/live-results" ? activeClass : linkClass}`}
            >
              <span
                className="live-dot size-3 shrink-0 rounded-full bg-red-500 ring-2 ring-red-400/60 dark:ring-red-400/70 inline-block flex-none mr-0.5"
                aria-hidden
              />
              <span className="whitespace-nowrap truncate">Live Election Results</span>
            </Link>
            <Link
              href="/notable-races"
              className={`py-2 -my-2 whitespace-nowrap truncate hidden lg:inline min-w-0 ${pathname === "/notable-races" ? activeClass : linkClass}`}
            >
              Notable Races
            </Link>
            <Link
              href="/state-of-nation"
              className={`py-2 -my-2 whitespace-nowrap truncate hidden lg:inline min-w-0 ${pathname === "/state-of-nation" ? activeClass : linkClass}`}
              title="State of the Nation – Electoral map and election results"
            >
              State of the Nation
            </Link>
          </nav>
          {/* Right: theme + logo + title */}
          <div className="flex items-center justify-end min-w-0 flex-1 gap-1 lg:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link
              href={defaultHomeHref}
              className={`flex items-center gap-2 lg:gap-2.5 text-base lg:text-xl font-bold hover:opacity-90 py-2 min-w-0 lg:shrink-0 ${pathname === "/" || pathname === defaultHomeHref ? activeClass : "text-slate-900 dark:text-white"}`}
            >
              <LogoIcon className="shrink-0" />
              <span className="whitespace-nowrap truncate">US Election Tracker</span>
            </Link>
          </div>
        </div>
        {/* Row 2 (below lg): Notable Races (left), State of the Nation (right) — prevents overlap on vertical mobile */}
        <div className="flex lg:hidden items-center justify-between gap-4 min-w-0 py-0.5">
          <Link
            href="/notable-races"
            className={`min-w-0 truncate py-1.5 text-xs font-medium ${pathname === "/notable-races" ? activeClass : linkClass}`}
          >
            Notable Races
          </Link>
          <Link
            href="/state-of-nation"
            className={`min-w-0 truncate py-1.5 text-xs font-medium text-right ${pathname === "/state-of-nation" ? activeClass : linkClass}`}
            title="State of the Nation – Electoral map and election results"
          >
            State of the Nation
          </Link>
        </div>
      </div>
    </header>
  );
}
