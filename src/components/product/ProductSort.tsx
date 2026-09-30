"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type SortKey } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * ProductSort — a native select that rewrites the `sort` query param.
 *
 * Uses a real `<select>` rather than a custom listbox: it is keyboard and
 * screen-reader accessible for free and behaves natively on touch devices.
 */

export function ProductSort({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sort") as SortKey | null) ?? "featured";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <label htmlFor="product-sort" className="ap-eyebrow shrink-0 text-ink/50">
        Sort
      </label>
      <div className="relative">
        <select
          id="product-sort"
          value={current}
          onChange={(event) => onChange(event.target.value)}
          className="ap-eyebrow cursor-pointer appearance-none border-b border-line bg-transparent py-2 pl-1 pr-8 text-ink outline-none transition-colors hover:border-ink focus:border-burnt"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/50"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </div>
    </div>
  );
}
