"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { StateFill, StateMap } from "@/types/election";
import statePaths from "@/data/state-paths.json";

const FILL_COLORS: Record<StateFill, string> = {
  undecided: "#C0C0C0",
  dem: "#0099ff",
  rep: "#ff0000",
  demLead: "#78f8ff",
  repLead: "rgba(255, 91, 80, 0.55)",
  split: "#D820E6",
  highlight: "#eab308",
};

/** State labels: 2-letter USPS codes only (e.g. WV, CA). No dots, no long form. */
const STATES = statePaths as { id: string; d: string }[];

/** Small states use a reduced font size so labels don't overlap in the NE and elsewhere. */
const SMALL_STATES = new Set(["RI", "CT", "DE", "MD", "NJ", "MA", "VT", "NH", "DC"]);

/**
 * Manual label positioning (edit this to adjust letters within states).
 * Map viewBox is 0 0 1000 600 (x: 0–1000, y: 0–600; y increases downward).
 *
 * Two options per state:
 * 1. Relative nudge from auto center: use dx and/or dy (positive dx = right, positive dy = down).
 * 2. Fixed position: use x and y in viewBox coordinates to place the label exactly.
 *
 * Examples:
 *   CA: { dy: 5 }           — move CA label down 5 units from center
 *   TX: { x: 420, y: 380 }   — put TX label at exact viewBox position
 */
const LABEL_POSITION_OVERRIDES: Record<
  string,
  { dx?: number; dy?: number } | { x: number; y: number }
> = {
  AK: { dx: 10, dy: -15 },
  CA: { dx: -15, dy: 10 },
  CT: { dx: -4, dy: 2 },
  DE: { dx: 6, dy: 0 },
  FL: { dx: 45, dy: -5 },
  GA: { dx: -2, dy: 0 },
  HI: { dx: 10, dy: 20 },
  ID: { dx: -5, dy: 30 },
  IL: { dx: 5, dy: -5 },
  KY: { dx: 12, dy: 5 },
  LA: { dx: -20, dy: 0 },
  MA: { dx: -5, dy: -2 },
  MD: { dx: 2, dy: -8 },
  MI: { dx: 28, dy: 40 },
  MN: { dx: -15, dy: 10 },
  NC: { dx: 15, dy: 0 },
  NH: { dx: -2, dy: 15 },
  NJ: { dx: 4, dy: -2 },
  NV: { dx: 0, dy: -10 },
  OK: { dx: 25, dy: 0 },
  RI: { dx: 8, dy: -2 },
  SC: { dx: 8, dy: -5 },
  TX: { dx: 20, dy: -5 },
  VA: { dx: 15, dy: 3 },
  VT: { dx: 0, dy: 4 },
  WV: { dx: -9, dy: 8 },
};

interface UsMapProps {
  stateFills: StateMap;
  className?: string;
  /** State code to highlight (e.g. SC); that state gets a focus ring */
  highlightState?: string;
  /** Called when a state path is clicked (state code) */
  onStateClick?: (stateCode: string) => void;
  /** Called when pointer enters a state (state code, mouse event for tooltip position) */
  onStateMouseEnter?: (stateCode: string, e: React.MouseEvent) => void;
  /** Called when pointer leaves a state */
  onStateMouseLeave?: () => void;
}

export function UsMap({
  stateFills,
  className = "",
  highlightState,
  onStateClick,
  onStateMouseEnter,
  onStateMouseLeave,
}: UsMapProps) {
  const hasHover = onStateMouseEnter != null;
  const svgRef = useRef<SVGSVGElement>(null);
  const [labelPositions, setLabelPositions] = useState<Record<string, { x: number; y: number }>>({});

  useLayoutEffect(() => {
    const next: Record<string, { x: number; y: number }> = {};
    for (const { id } of STATES) {
      const el = svgRef.current?.querySelector(`#${CSS.escape(id)}`) as SVGPathElement | null;
      if (el) {
        try {
          const bbox = el.getBBox();
          next[id] = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
          };
        } catch {
          // ignore
        }
      }
    }
    setLabelPositions((prev) => (Object.keys(next).length ? next : prev));
  }, [stateFills]);

  return (
    <svg
      ref={svgRef}
      className={`outline-none ${className}`}
      viewBox="0 0 1000 600"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-label="US election map"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <defs>
        <filter id="highlight-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main map: all states except DC (DC is shown in its own box below) */}
      <g>
        {STATES.filter((s) => s.id !== "DC").map(({ id, d }) => {
          const fill = stateFills[id] ?? "undecided";
          const color = FILL_COLORS[fill];
          const isHighlighted = highlightState === id;
          const strokeClass = isHighlighted
            ? "stroke-blue-600 dark:stroke-blue-400"
            : "stroke-white dark:stroke-slate-800";
          const strokeWidthClass =
            isHighlighted ? "stroke-[3px]" : "stroke-[0.5px] dark:stroke-[1px]";
          return (
            <path
              key={id}
              id={id}
              d={d}
              fill={color}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter={isHighlighted ? "url(#highlight-glow)" : undefined}
              className={`${strokeClass} ${strokeWidthClass} transition-all duration-200 ${
                onStateClick || hasHover ? "cursor-pointer hover:opacity-90" : ""
              }`}
              onClick={onStateClick ? () => onStateClick(id) : undefined}
              onMouseEnter={onStateMouseEnter ? (e) => onStateMouseEnter(id, e) : undefined}
              onMouseLeave={onStateMouseLeave}
              role={onStateClick ? "button" : undefined}
              aria-label={onStateClick ? `${id} results` : undefined}
            />
          );
        })}
      </g>
      {/* On-map labels: skip DC (shown in inset box) */}
      <g aria-hidden="true" style={{ pointerEvents: "none" }}>
        {STATES.filter((s) => s.id !== "DC").map(({ id }) => {
          const pos = labelPositions[id];
          const override = LABEL_POSITION_OVERRIDES[id];
          const fixed = override && "x" in override ? (override as { x: number; y: number }) : null;
          if (!fixed && !pos) return null;
          const rel = override && "dx" in override ? (override as { dx?: number; dy?: number }) : null;
          const x = fixed ? fixed.x : pos!.x + (rel?.dx ?? 0);
          const y = fixed ? fixed.y : pos!.y + (rel?.dy ?? 0);
          const isSmall = SMALL_STATES.has(id);
          const fontSizePx = isSmall ? 12 : 18;
          return (
            <text
              key={id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white font-medium tracking-wider select-none stroke-slate-900/70 dark:stroke-slate-950/80"
              style={{
                paintOrder: "stroke fill",
                fontSize: `${fontSizePx}px`,
                strokeWidth: isSmall ? 1 : 1.5,
              }}
            >
              {id}
            </text>
          );
        })}
      </g>
      {/* DC inset: own box away from the map (same fill, click, hover as a state) */}
      <g
        className={onStateClick || hasHover ? "cursor-pointer hover:opacity-90" : ""}
        onClick={onStateClick ? () => onStateClick("DC") : undefined}
        onMouseEnter={onStateMouseEnter ? (e) => onStateMouseEnter("DC", e) : undefined}
        onMouseLeave={onStateMouseLeave}
        role={onStateClick ? "button" : undefined}
        aria-label={onStateClick ? "DC results" : undefined}
      >
        <rect
          x={876}
          y={261}
          width={48}
          height={30}
          rx={4}
          fill={FILL_COLORS[stateFills["DC"] ?? "undecided"]}
          strokeWidth={highlightState === "DC" ? 3 : 1}
          className={
            highlightState === "DC"
              ? "stroke-blue-600 dark:stroke-blue-400"
              : "stroke-white dark:stroke-slate-800"
          }
          filter={highlightState === "DC" ? "url(#highlight-glow)" : undefined}
        />
        <text
          x={900}
          y={276}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-medium tracking-wider select-none stroke-slate-900/70 dark:stroke-slate-950/80 pointer-events-none"
          style={{ paintOrder: "stroke fill", fontSize: "15px", strokeWidth: 1 }}
        >
          DC
        </text>
      </g>
    </svg>
  );
}
