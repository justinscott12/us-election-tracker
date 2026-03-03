"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { CongressSummary, NotableRace, RaceStatus, StateMap } from "@/types/election";
import { getStateCode, STATE_CODE_TO_NAME, STATE_ELECTORAL_VOTES } from "@/lib/state-codes";
import { UsMap } from "./UsMap";

const STATUS_LABELS: Record<RaceStatus, string> = {
  "too-early": "Too early to call",
  "too-close": "Too close to call",
  called: "Called",
  final: "Final",
};

/** Tailwind classes for status pill/badge (bg and text, light + dark) */
const STATUS_STYLES: Record<RaceStatus, string> = {
  "too-early": "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200",
  "too-close": "bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200",
  called: "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200",
  final: "bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-200",
};

/** Format ISO date (YYYY-MM-DD) as "March 3rd" or "March 3rd, 2026" when year differs from current */
function formatRaceDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const yearNow = new Date().getFullYear();
  return year !== yearNow ? `${month} ${day}${suffix}, ${year}` : `${month} ${day}${suffix}`;
}

/** Last word of full name (e.g. "Jasmine Crockett" → "Crockett") */
function lastName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1]! : name;
}

/** Sort results by leader first: pct descending, then votes descending */
function sortResultsByLeader<T extends { pct?: number; votes?: number }>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    const ap = a.pct ?? -1;
    const bp = b.pct ?? -1;
    if (bp !== ap) return bp - ap;
    return (b.votes ?? -1) - (a.votes ?? -1);
  });
}

/** Format ISO timestamp as "Updated 3:45 PM" (today), "Updated Mar 2, 3:45 PM" (this year), or "Updated Mar 2, 2025, 3:45 PM" (other year) */
function formatLastUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (sameDay) return `Updated ${timeStr}`;
  const sameYear = d.getFullYear() === now.getFullYear();
  const dateStr = sameYear
    ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `Updated ${dateStr}, ${timeStr}`;
}

interface NotableRacesProps {
  races: NotableRace[];
  stateFills?: StateMap;
  /** When set (e.g. on US Senate tab), show current Senate score from State of the Nation */
  congress?: CongressSummary;
  /** Optional heading above the race cards (default: "Upcoming Major Primaries") */
  title?: string;
  /** Heading level for the title (default 1). Use 2 when page already has an h1, e.g. live-results. */
  titleHeadingLevel?: 1 | 2;
  /** When true (e.g. Live Results page), show compact results on each card: last names and pct */
  showResultsOnCards?: boolean;
}

const STORAGE_KEY = "notableRacesSelectedState";

export function NotableRaces({ races, stateFills = {}, congress, title = "Upcoming Major Primaries", titleHeadingLevel = 1, showResultsOnCards = false }: NotableRacesProps) {
  const senateDemAligned = congress ? congress.senateDem + (congress.senateInd ?? 0) : 0;
  const [selectedRace, setSelectedRace] = useState<NotableRace | null>(null);
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);
  const [expandedWhyItMatters, setExpandedWhyItMatters] = useState<Set<string>>(new Set());
  const mapRef = useRef<HTMLDivElement>(null);
  const hasRestoredRef = useRef(false);

  // Restore popup state from sessionStorage after refresh (once, when races are available)
  useEffect(() => {
    if (races.length === 0 || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const stateRaces = races.filter((r) => getStateCode(r) === saved);
      if (stateRaces.length > 0) {
        setSelectedStateCode(saved);
        setSelectedRace(stateRaces[0]);
      }
    } catch {
      // ignore
    }
  }, [races]);

  // Persist popup state when selection changes
  useEffect(() => {
    if (selectedStateCode) {
      try {
        sessionStorage.setItem(STORAGE_KEY, selectedStateCode);
      } catch {
        // ignore
      }
    } else {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [selectedStateCode]);

  const handleRaceClick = useCallback((race: NotableRace) => {
    setSelectedRace((prev) => {
      const next = prev?.id === race.id ? null : race;
      if (next) {
        setSelectedStateCode(getStateCode(next) ?? null);
        setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80);
      } else {
        setSelectedStateCode(null);
      }
      return next;
    });
  }, []);

  const handleStateClick = useCallback((stateCode: string) => {
    const stateRaces = races.filter((r) => getStateCode(r) === stateCode);
    if (stateRaces.length > 0) {
      setSelectedStateCode(stateCode);
      setSelectedRace(stateRaces[0]);
      setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80);
    }
  }, [races]);

  const stateRaces = selectedStateCode
    ? races.filter((r) => getStateCode(r) === selectedStateCode)
    : [];
  const showPresidentialEv = stateRaces.some((r) => r.office === "presidential");

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {congress && (
          <section className="text-center">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-800/50 p-4 max-w-xs mx-auto">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Senate</h3>
              <p className="text-slate-900 dark:text-slate-100 text-lg font-semibold">
                <span className="text-blue-600 dark:text-blue-400">D {senateDemAligned}</span>
                <span className="text-slate-400 mx-1">·</span>
                <span className="text-red-600 dark:text-red-400">R {congress.senateRep}</span>
              </p>
              {congress.lastUpdated && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Last updated: {new Date(congress.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </section>
        )}
        {titleHeadingLevel === 1 ? (
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200 text-center">
            {title}
          </h1>
        ) : (
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 text-center">
            {title}
          </h2>
        )}

        {!races.length ? (
          <p className="text-slate-500 dark:text-slate-400 text-center">
            No upcoming notable races. Use the API to add races.
          </p>
        ) : (
          <div
            className={`grid gap-4 justify-items-center ${
              races.length >= 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {races.map((race) => (
              <button
                key={race.id}
                type="button"
                onClick={() => handleRaceClick(race)}
                className={`w-full max-w-sm text-left rounded-lg border p-4 shadow-sm transition-all ${
                  selectedRace?.id === race.id
                    ? "border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-900/30 shadow-md ring-2 ring-blue-400/50"
                    : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{race.title}</span>
                  {!showResultsOnCards && race.status && (
                    <span className={`text-xs font-medium rounded px-2 py-0.5 shrink-0 inline-flex items-center gap-1 ${STATUS_STYLES[race.status]}`}>
                      {(race.status === "called" || race.status === "final") && (
                        <span className="text-green-600 dark:text-green-400" aria-hidden>✓</span>
                      )}
                      {STATUS_LABELS[race.status]}
                    </span>
                  )}
                </div>
                {showResultsOnCards ? (
                  <>
                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                      {formatRaceDate(race.date)}
                      {race.state && (
                        <>
                          {" "}
                          <span className="text-xs rounded bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-normal text-slate-600 dark:text-slate-300">
                            {race.state}
                          </span>
                        </>
                      )}
                      {" "}
                      <span className="text-xs uppercase text-slate-400 dark:text-slate-500 font-normal">{race.type}</span>
                    </p>
                    {race.status && (
                      <p className="mt-1">
                        <span className={`text-xs font-medium rounded px-2 py-0.5 inline-flex items-center gap-1 ${STATUS_STYLES[race.status]}`}>
                          {(race.status === "called" || race.status === "final") && (
                            <span className="text-green-600 dark:text-green-400" aria-hidden>✓</span>
                          )}
                          {STATUS_LABELS[race.status]}
                        </span>
                      </p>
                    )}
                    {race.votesCountedPct != null && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {race.votesCountedPct}% est. votes in
                      </p>
                    )}
                    {race.results && race.results.length > 0 && race.results.some((r) => r.pct != null) && (
                      <p className="mt-2 flex flex-wrap gap-1.5">
                        {sortResultsByLeader(race.results).map((r, idx) => {
                          const pct = r.pct != null ? r.pct : 0;
                          const party = (r.party ?? "").toUpperCase();
                          const parties = [...new Set(race.results!.map((x) => (x.party ?? "").toUpperCase()))].filter(Boolean);
                          const sameParty = parties.length <= 1;
                          const style =
                            sameParty && party === "D"
                              ? idx % 3 === 0
                                ? "bg-blue-800 text-white dark:bg-blue-700 dark:text-white"
                                : idx % 3 === 1
                                  ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-white"
                                  : "bg-blue-300 text-blue-900 dark:bg-blue-200 dark:text-blue-900"
                              : sameParty && party === "R"
                                ? idx % 3 === 0
                                  ? "bg-red-800 text-white dark:bg-red-700 dark:text-white"
                                  : idx % 3 === 1
                                    ? "bg-red-500 text-white dark:bg-red-400 dark:text-white"
                                    : "bg-red-300 text-red-900 dark:bg-red-200 dark:text-red-900"
                                : party === "D"
                                  ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-white"
                                  : party === "R"
                                    ? "bg-red-500 text-white dark:bg-red-400 dark:text-white"
                                    : "bg-slate-500 text-white dark:bg-slate-400 dark:text-white";
                          return (
                            <span
                              key={r.name}
                              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium tabular-nums ${style}`}
                            >
                              {lastName(r.name)} {pct}%
                            </span>
                          );
                        })}
                      </p>
                    )}
                    {race.lastUpdated && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400" title={new Date(race.lastUpdated).toLocaleString()}>
                        {formatLastUpdated(race.lastUpdated)}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                      {formatRaceDate(race.date)}
                    </span>
                    {race.state && (
                      <span className="text-xs rounded bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-slate-600 dark:text-slate-300">
                        {race.state}
                      </span>
                    )}
                    <span className="text-xs uppercase text-slate-400 dark:text-slate-500">{race.type}</span>
                    {race.votesCountedPct != null && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">{race.votesCountedPct}% est. votes in</span>
                    )}
                    {race.lastUpdated && (
                      <span className="text-xs text-slate-500 dark:text-slate-400" title={new Date(race.lastUpdated).toLocaleString()}>
                        {formatLastUpdated(race.lastUpdated)}
                      </span>
                    )}
                  </div>
                )}
                {(race.status === "called" || race.status === "final") && race.results?.some((r) => r.winner) && (
                  <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-400">
                    Winner: {race.results.find((r) => r.winner)!.name}
                  </p>
                )}
                {race.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{race.description}</p>
                )}
              </button>
            ))}
          </div>
        )}

        <div
          ref={mapRef}
          className="scroll-mt-4"
        >
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2 text-center">Map</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 text-center">
            Click any highlighted state to see its races.
          </p>
          <div
            className="relative max-w-2xl mx-auto w-full rounded-lg overflow-hidden bg-white dark:bg-slate-800 min-h-[min(50vh,400px)]"
            style={{ maxHeight: "70vh", aspectRatio: "5/3" }}
          >
            <UsMap
              key="notable-races-map"
              stateFills={stateFills}
              highlightState={selectedStateCode ?? undefined}
              onStateClick={handleStateClick}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* State popup: same style as State of the Nation (bottom-right corner card) */}
      {selectedStateCode != null && stateRaces.length > 0 && (
        <div
          className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 sm:left-auto sm:right-4 sm:top-auto sm:bottom-4 sm:translate-x-0 sm:translate-y-0 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl p-2 sm:p-3 max-h-[85vh] sm:max-h-[70vh] ${
            stateRaces.length > 2 ? "max-w-2xl w-[95vw]" : stateRaces.length > 1 ? "max-w-xl w-[90vw]" : "w-72"
          }`}
          role="dialog"
          aria-modal="false"
          aria-labelledby="notable-race-state-title"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 id="notable-race-state-title" className="font-semibold text-slate-900 dark:text-white text-sm">
                {STATE_CODE_TO_NAME[selectedStateCode] ?? selectedStateCode}
              </h3>
              {showPresidentialEv && STATE_ELECTORAL_VOTES[selectedStateCode] != null && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {STATE_ELECTORAL_VOTES[selectedStateCode]} electoral vote{STATE_ELECTORAL_VOTES[selectedStateCode] !== 1 ? "s" : ""}
                </p>
              )}
              {(() => {
                const latest = stateRaces.reduce<string | null>((acc, r) => (r.lastUpdated && (!acc || r.lastUpdated > acc) ? r.lastUpdated : acc), null);
                return latest ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" title={new Date(latest).toLocaleString()}>
                    {formatLastUpdated(latest)}
                  </p>
                ) : null;
              })()}
            </div>
            <button
              type="button"
              onClick={() => { setSelectedStateCode(null); setSelectedRace(null); setExpandedWhyItMatters(new Set()); }}
              className="shrink-0 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div
            className={
              stateRaces.length > 2
                ? "mt-1.5 sm:mt-2 gap-2 sm:gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                : stateRaces.length > 1
                  ? "mt-1.5 sm:mt-2 gap-2 sm:gap-3 grid grid-cols-1 sm:grid-cols-2"
                  : "mt-2"
            }
          >
            {stateRaces.map((race) => {
              const showUnifiedTable = stateRaces.length > 1;
              const showParty = showUnifiedTable || race.results?.some((r) => r.party != null);
              const showVotes = showUnifiedTable || race.results?.some((r) => r.votes != null);
              const showPct = showUnifiedTable || race.results?.some((r) => r.pct != null);
              return (
              <div
                key={race.id}
                className={stateRaces.length > 1 ? "min-w-0 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 sm:p-2 flex flex-col" : ""}
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-medium">{race.title}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 sm:mb-1.5 tabular-nums">
                  {formatRaceDate(race.date)}
                </p>
                {race.lastUpdated && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5" title={new Date(race.lastUpdated).toLocaleString()}>
                    {formatLastUpdated(race.lastUpdated)}
                  </p>
                )}
                {race.status && (
                  <p className="mb-1 sm:mb-1.5">
                    <span className={`text-xs font-medium rounded px-2 py-1 inline-flex items-center gap-1.5 ${STATUS_STYLES[race.status]}`}>
                      {(race.status === "called" || race.status === "final") && (
                        <span className="text-green-600 dark:text-green-400" aria-hidden>✓</span>
                      )}
                      {STATUS_LABELS[race.status]}
                    </span>
                  </p>
                )}
                {(race.status === "called" || race.status === "final") && race.results?.some((r) => r.winner) && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1 sm:mb-1.5">
                    Winner: {race.results.find((r) => r.winner)!.name}
                  </p>
                )}
                {(showUnifiedTable || race.votesCountedPct != null) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5">
                    {race.votesCountedPct != null ? `${race.votesCountedPct}% est. votes in` : "0% est. votes in"}
                  </p>
                )}
                {race.results && race.results.length > 0 ? (
                  (() => {
                    const sortedResults = sortResultsByLeader(race.results);
                    return (
                  <div className="overflow-x-auto -mx-1 mb-1.5 sm:mb-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                          <th className="text-left py-0.5 sm:py-1 pr-2 font-medium">Candidate</th>
                          {showParty && (
                            <th className="text-right py-0.5 sm:py-1 pl-2 pr-2 font-medium">Party</th>
                          )}
                          {showVotes && (
                            <th className="text-right py-0.5 sm:py-1 pl-2 font-medium">Votes</th>
                          )}
                          {showPct && (
                            <th className="text-right py-0.5 sm:py-1 pl-2 font-medium">Pct.</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedResults.map((r, idx) => (
                          <tr key={r.name} className="border-b border-slate-100 dark:border-slate-700/50">
                            <td className="py-1 sm:py-1.5 pr-2">
                              <span className="text-slate-700 dark:text-slate-300">{r.name}</span>
                              {(race.status === "called" || race.status === "final") && idx === 0 && (
                                <span className="text-green-600 dark:text-green-400 ml-1" aria-hidden title="Winner">✓</span>
                              )}
                            </td>
                            {showParty && (
                              <td className="py-1 sm:py-1.5 pl-2 pr-2 text-right text-slate-600 dark:text-slate-400">{r.party ?? "—"}</td>
                            )}
                            {showVotes && (
                              <td className="py-1 sm:py-1.5 pl-2 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                                {r.votes != null ? r.votes.toLocaleString() : (showUnifiedTable ? "0" : "—")}
                              </td>
                            )}
                            {showPct && (
                              <td className="py-1 sm:py-1.5 pl-2 text-right text-slate-900 dark:text-slate-100 tabular-nums">
                                {r.pct != null ? `${r.pct}%` : (showUnifiedTable ? "0%" : "—")}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-1">No results yet.</p>
                )}
                {(race.description || race.significance) && (
                  <div className={`mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-600 ${stateRaces.length > 1 ? "sm:mt-auto" : ""}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Why it matters</p>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      {race.description && (
                        <p className={expandedWhyItMatters.has(race.id) ? "" : "line-clamp-2"}>{race.description}</p>
                      )}
                      {race.significance && (
                        <p className={expandedWhyItMatters.has(race.id) ? "" : "line-clamp-2"}>{race.significance}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedWhyItMatters((prev) => {
                          const next = new Set(prev);
                          if (next.has(race.id)) next.delete(race.id);
                          else next.add(race.id);
                          return next;
                        })
                      }
                      className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {expandedWhyItMatters.has(race.id) ? "Show less" : "Show more"}
                    </button>
                  </div>
                )}
              </div>
            );
            })}
          </div>
          <button
            type="button"
            onClick={() => { setSelectedStateCode(null); setSelectedRace(null); setExpandedWhyItMatters(new Set()); }}
            className="mt-2 sm:mt-3 w-full py-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
