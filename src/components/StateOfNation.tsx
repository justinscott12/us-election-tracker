"use client";

import { useState } from "react";
import type { StateOfNation as StateOfNationType, RaceStatus } from "@/types/election";
import type { OfficeTabId } from "@/types/election";
import { STATE_CODE_TO_NAME, STATE_ELECTORAL_VOTES } from "@/lib/state-codes";
import { UsMap } from "./UsMap";

const STATUS_LABELS: Record<RaceStatus, string> = {
  "too-early": "Too early to call",
  "too-close": "Too close to call",
  called: "Called",
  final: "Final",
};

interface StateOfNationProps {
  data: StateOfNationType;
  /** When set, only this section is rendered (for tabbed page). */
  section?: OfficeTabId;
}

export function StateOfNation({ data, section }: StateOfNationProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<{ code: string; x: number; y: number } | null>(null);
  const { presidential, governors, congress } = data;
  const totalEV = 538;
  const demPct = (presidential.demEV / totalEV) * 100;
  const repPct = (presidential.repEV / totalEV) * 100;
  const stateResults = presidential.stateResults ?? {};
  const selectedResult = selectedStateCode ? stateResults[selectedStateCode] : null;
  const selectedStateName = selectedStateCode ? STATE_CODE_TO_NAME[selectedStateCode] ?? selectedStateCode : null;
  const hoveredResult = hoveredState ? stateResults[hoveredState.code] : null;
  const hoveredStateName = hoveredState ? STATE_CODE_TO_NAME[hoveredState.code] ?? hoveredState.code : null;

  const senateDemAligned = congress.senateDem + (congress.senateInd ?? 0);

  const showCongress = !section || section === "congress";
  const showPresidential = !section || section === "presidential";
  const showGovernors = !section || section === "governor";

  return (
    <div className="flex-1 flex flex-col min-h-0 p-6">
      <div className="max-w-[75vw] mx-auto space-y-8 flex-1 min-h-0 overflow-y-auto">
        {showCongress && (
          <section className="text-center py-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-8">Congress</h2>
            <div className={`grid gap-8 mx-auto ${section === "congress" ? "grid-cols-1 max-w-md" : "grid-cols-2 max-w-sm"}`}>
              <div className={`rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 ${section === "congress" ? "p-10" : "p-4"}`}>
                <h3 className={`font-medium text-slate-500 dark:text-slate-400 mb-2 ${section === "congress" ? "text-lg" : "text-sm"}`}>Senate</h3>
                <p className={`text-slate-900 dark:text-slate-100 font-semibold ${section === "congress" ? "text-4xl" : "text-lg"}`}>
                  <span className="text-blue-600 dark:text-blue-400">D {senateDemAligned}</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-red-600 dark:text-red-400">R {congress.senateRep}</span>
                </p>
              </div>
              <div className={`rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 ${section === "congress" ? "p-10" : "p-4"}`}>
                <h3 className={`font-medium text-slate-500 dark:text-slate-400 mb-2 ${section === "congress" ? "text-lg" : "text-sm"}`}>House</h3>
                <p className={`text-slate-900 dark:text-slate-100 font-semibold ${section === "congress" ? "text-4xl" : "text-lg"}`}>
                  <span className="text-blue-600 dark:text-blue-400">D {congress.houseDem}</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-red-600 dark:text-red-400">R {congress.houseRep}</span>
                </p>
              </div>
            </div>
            {congress.lastUpdated && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
                Last updated: {new Date(congress.lastUpdated).toLocaleString()}
              </p>
            )}
          </section>
        )}

        {showPresidential && (
          <>
            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
                President (2024)
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  {presidential.demImageUrl && (
                    <img
                      src={presidential.demImageUrl}
                      alt={`${presidential.demName} – presidential candidate`}
                      className="size-[60px] rounded-full object-cover shrink-0 border-2 border-blue-500/50"
                    />
                  )}
                  <span className="flex items-center gap-1">
                    {presidential.demEV > presidential.repEV && <span className="text-green-600 dark:text-green-400">✓</span>}
                    {presidential.demName} — {presidential.demEV} EV
                  </span>
                </div>
                <div className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                  {presidential.repImageUrl && (
                    <img
                      src={presidential.repImageUrl}
                      alt={`${presidential.repName} – presidential candidate`}
                      className="size-[60px] rounded-full object-cover shrink-0 border-2 border-red-500/50"
                    />
                  )}
                  <span className="flex items-center gap-1">
                    {presidential.repEV > presidential.demEV && <span className="text-green-600 dark:text-green-400">✓</span>}
                    {presidential.repName} — {presidential.repEV} EV
                  </span>
                </div>
              </div>
              <div className="relative h-10 flex rounded overflow-hidden bg-slate-200 border border-slate-300 dark:bg-slate-600 dark:border-slate-500 w-full">
                <div
                  className="bg-blue-500 transition-all h-full"
                  style={{ width: `${demPct}%` }}
                />
                <div
                  className="bg-red-500 transition-all h-full"
                  style={{ width: `${repPct}%` }}
                />
                <div
                  className="absolute inset-y-0 w-0 flex flex-col items-center pointer-events-none"
                  style={{ left: `${(270 / totalEV) * 100}%`, transform: "translateX(-50%)" }}
                >
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap bg-white/95 dark:bg-slate-800/95 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600">
                    270 to win
                  </span>
                  <div className="w-0.5 h-full bg-white/90 dark:bg-slate-200/90 shadow-sm min-h-[24px]" />
                </div>
              </div>
              {presidential.demPopularVote != null && presidential.repPopularVote != null && (
                <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>
                    {presidential.demPopularVote.toLocaleString()} votes
                    {(() => {
                      const total = presidential.totalPopularVote ?? presidential.demPopularVote! + presidential.repPopularVote!;
                      const pct = total > 0 ? (presidential.demPopularVote! / total) * 100 : 0;
                      return <span> ({pct.toFixed(1)}%)</span>;
                    })()}
                  </span>
                  <span>
                    {presidential.repPopularVote.toLocaleString()} votes
                    {(() => {
                      const total = presidential.totalPopularVote ?? presidential.demPopularVote! + presidential.repPopularVote!;
                      const pct = total > 0 ? (presidential.repPopularVote! / total) * 100 : 0;
                      return <span> ({pct.toFixed(1)}%)</span>;
                    })()}
                  </span>
                </div>
              )}
              {presidential.lastUpdated && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                  Last updated: {new Date(presidential.lastUpdated).toLocaleString()}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 text-center">Map</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 text-center">
                Click a state to see vote percentages and counts.
              </p>
              <div
                className="relative max-w-2xl mx-auto w-full rounded-lg overflow-hidden bg-white dark:bg-slate-800 min-h-[min(50vh,400px)]"
                style={{ maxHeight: "70vh", aspectRatio: "5/3" }}
              >
                <UsMap
                  key="state-of-nation-map"
                  stateFills={presidential.stateFills}
                  className="absolute inset-0 h-full w-full"
                  onStateClick={(code) => setSelectedStateCode(code)}
                  onStateMouseEnter={(code, e) =>
                    setHoveredState({ code, x: e.clientX, y: e.clientY })
                  }
                  onStateMouseLeave={() => setHoveredState(null)}
                />
              </div>

              {hoveredState && (
                <div
                  className="pointer-events-none fixed z-50 w-56 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl p-2.5 text-left"
                  style={{ left: hoveredState.x + 12, top: hoveredState.y + 12 }}
                  role="tooltip"
                  aria-live="polite"
                >
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {hoveredStateName}
                  </p>
                  {hoveredState.code && STATE_ELECTORAL_VOTES[hoveredState.code] != null && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {STATE_ELECTORAL_VOTES[hoveredState.code]} electoral vote{STATE_ELECTORAL_VOTES[hoveredState.code] !== 1 ? "s" : ""}
                    </p>
                  )}
                  {hoveredResult?.status != null && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {hoveredResult.status === "called" || hoveredResult.status === "final"
                        ? "Race called"
                        : STATUS_LABELS[hoveredResult.status]}
                    </p>
                  )}
                  {hoveredResult?.votesCountedPct != null && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {hoveredResult.votesCountedPct}% of votes in
                    </p>
                  )}
                  {hoveredResult ? (
                    <div className="mt-1.5 space-y-1 text-xs">
                      {(() => {
                        const raceCalled =
                          hoveredResult.status === "called" || hoveredResult.status === "final";
                        const demWins = hoveredResult.demPct > hoveredResult.repPct;
                        return (
                          <>
                            <p className="text-blue-600 dark:text-blue-400">
                              {presidential.demName}
                              {raceCalled && demWins && <span className="text-green-600 dark:text-green-400 ml-1" aria-hidden>✓</span>}
                              : {hoveredResult.demPct.toFixed(1)}%
                              {hoveredResult.demVotes != null &&
                                ` (${hoveredResult.demVotes.toLocaleString()})`}
                            </p>
                            <p className="text-red-600 dark:text-red-400">
                              {presidential.repName}
                              {raceCalled && !demWins && <span className="text-green-600 dark:text-green-400 ml-1" aria-hidden>✓</span>}
                              : {hoveredResult.repPct.toFixed(1)}%
                              {hoveredResult.repVotes != null &&
                                ` (${hoveredResult.repVotes.toLocaleString()})`}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No data</p>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {showGovernors && (
          <section className="text-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Governors</h2>
            {governors.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No governor races listed.</p>
            ) : (
              <ul className="space-y-2 inline-block text-left">
                {governors.map((g) => (
                  <li
                    key={g.stateCode}
                    className="flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="font-medium">{g.state}</span>
                    <span className="text-slate-500 dark:text-slate-400">—</span>
                    <span>
                      {g.status === "called" && g.winner
                        ? `${g.winner} (${g.party})`
                        : g.status}
                    </span>
                    {g.note && (
                      <span className="text-slate-500 dark:text-slate-400 text-xs">({g.note})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {selectedStateCode && (
        <div
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 sm:left-auto sm:right-4 sm:top-auto sm:bottom-4 sm:translate-x-0 sm:translate-y-0 w-72 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl p-3"
          role="dialog"
          aria-modal="false"
          aria-labelledby="state-results-title"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 id="state-results-title" className="font-semibold text-slate-900 dark:text-white text-sm">
                {selectedStateName}
              </h3>
              {selectedStateCode && STATE_ELECTORAL_VOTES[selectedStateCode] != null && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {STATE_ELECTORAL_VOTES[selectedStateCode]} electoral vote{STATE_ELECTORAL_VOTES[selectedStateCode] !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedStateCode(null)}
              className="shrink-0 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-1.5">2024 President</p>
          {selectedResult ? (
            <>
              {selectedResult.status && (
                <p className="mb-1.5">
                  <span className={`text-xs font-medium rounded px-2 py-1 inline-flex items-center gap-1.5 ${
                    selectedResult.status === "called" || selectedResult.status === "final"
                      ? "bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200"
                  }`}>
                    {(selectedResult.status === "called" || selectedResult.status === "final") && (
                      <span className="text-green-600 dark:text-green-400" aria-hidden>✓</span>
                    )}
                    {STATUS_LABELS[selectedResult.status]}
                  </span>
                </p>
              )}
              {selectedResult.votesCountedPct != null && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  {selectedResult.votesCountedPct}% est. votes in
                </p>
              )}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                      <th className="text-left py-1 pr-2 font-medium">Candidate</th>
                      {(selectedResult.demVotes != null || selectedResult.repVotes != null) && (
                        <th className="text-right py-1 pl-2 font-medium">Votes</th>
                      )}
                      <th className="text-right py-1 pl-2 font-medium">Pct.</th>
                      <th className="text-right py-1 pl-2 font-medium w-8">E.V.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const demWins = selectedResult.demPct > selectedResult.repPct;
                      const repWins = selectedResult.repPct > selectedResult.demPct;
                      const ev = selectedStateCode ? STATE_ELECTORAL_VOTES[selectedStateCode] ?? 0 : 0;
                      const showVotes = selectedResult.demVotes != null || selectedResult.repVotes != null;
                      const raceCalled = selectedResult.status === "called" || selectedResult.status === "final";
                      return (
                        <>
                          <tr className="border-b border-slate-100 dark:border-slate-700/50">
                            <td className="py-1.5 pr-2">
                              <span className="text-blue-600 dark:text-blue-400">{data.presidential.demName}</span>
                              {raceCalled && demWins && <span className="text-green-600 dark:text-green-400 ml-1" aria-hidden>✓</span>}
                            </td>
                            {showVotes && (
                              <td className="py-1.5 pl-2 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                                {selectedResult.demVotes != null ? selectedResult.demVotes.toLocaleString() : "—"}
                              </td>
                            )}
                            <td className="py-1.5 pl-2 text-right text-slate-900 dark:text-slate-100 tabular-nums">
                              {selectedResult.demPct.toFixed(1)}%
                            </td>
                            <td className="py-1.5 pl-2 text-right">{demWins ? ev : 0}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 pr-2">
                              <span className="text-red-600 dark:text-red-400">{data.presidential.repName}</span>
                              {raceCalled && repWins && <span className="text-green-600 dark:text-green-400 ml-1" aria-hidden>✓</span>}
                            </td>
                            {showVotes && (
                              <td className="py-1.5 pl-2 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                                {selectedResult.repVotes != null ? selectedResult.repVotes.toLocaleString() : "—"}
                              </td>
                            )}
                            <td className="py-1.5 pl-2 text-right text-slate-900 dark:text-slate-100 tabular-nums">
                              {selectedResult.repPct.toFixed(1)}%
                            </td>
                            <td className="py-1.5 pl-2 text-right">{repWins ? ev : 0}</td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-2">No percentage data for this state.</p>
          )}
          <button
            type="button"
            onClick={() => setSelectedStateCode(null)}
            className="mt-3 w-full py-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
