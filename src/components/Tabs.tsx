"use client";

import type { TabId } from "@/types/election";

const TABS: { id: TabId; label: string }[] = [
  { id: "notable-races", label: "Notable Races" },
  { id: "state-of-nation", label: "State of the Nation" },
];

interface TabsProps {
  active: TabId;
  defaultTab: TabId;
  onSelect: (id: TabId) => void;
}

export function Tabs({ active, defaultTab, onSelect }: TabsProps) {
  return (
    <div className="flex border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`min-w-[140px] px-4 py-3 text-sm font-medium transition-colors ${
            active === id
              ? "border-b-2 border-blue-600 text-blue-700 bg-white dark:border-blue-400 dark:text-blue-300 dark:bg-slate-900"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {label}
          {id === defaultTab && (
            <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">(default)</span>
          )}
        </button>
      ))}
    </div>
  );
}
