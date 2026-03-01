"use client";

export interface SubTabItem<T extends string> {
  id: T;
  label: string;
}

interface SubTabsProps<T extends string> {
  tabs: SubTabItem<T>[];
  active: T;
  onSelect: (id: T) => void;
}

export function SubTabs<T extends string>({ tabs, active, onSelect }: SubTabsProps<T>) {
  return (
    <div className="flex border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`min-w-[120px] px-4 py-3 text-sm font-medium transition-colors ${
            active === id
              ? "border-b-2 border-blue-600 text-blue-700 bg-white dark:border-blue-400 dark:text-blue-300 dark:bg-slate-900"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
