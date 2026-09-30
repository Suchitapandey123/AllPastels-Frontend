"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Faceted filter state, driven entirely by the URL.
 *
 * The query string is the single source of truth: every toggle rewrites
 * params via `router.replace`, so results are shareable, bookmarkable and
 * back-button friendly — and the server component can render the exact same
 * filtered list. No client-side copy of the catalogue is needed.
 */

export interface FilterActions {
  activeCategories: string[];
  activeMoods: string[];
  activeCollections: string[];
  minPrice: string | null;
  maxPrice: string | null;
  activeCount: number;
  toggleParam: (key: string, value: string) => void;
  setSingle: (key: string, value: string | null) => void;
  clearAll: () => void;
}

export function useProductFilters(): FilterActions {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router],
  );

  const activeCategories = searchParams.getAll("category");
  const activeMoods = searchParams.getAll("mood");
  const activeCollections = searchParams.getAll("collection");
  const minPrice = searchParams.get("min");
  const maxPrice = searchParams.get("max");

  /** Adds or removes one value from a repeated query param. */
  const toggleParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(key);

      if (current.includes(value)) {
        const remaining = current.filter((entry) => entry !== value);
        params.delete(key);
        remaining.forEach((entry) => params.append(key, entry));
      } else {
        params.append(key, value);
      }

      navigate(params);
    },
    [searchParams, navigate],
  );

  const setSingle = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);
      navigate(params);
    },
    [searchParams, navigate],
  );

  const clearAll = useCallback(() => {
    // Preserve the search term — clearing facets shouldn't drop the query.
    const params = new URLSearchParams();
    const query = searchParams.get("q");
    const sort = searchParams.get("sort");
    if (query) params.set("q", query);
    if (sort) params.set("sort", sort);
    navigate(params);
  }, [searchParams, navigate]);

  return {
    activeCategories,
    activeMoods,
    activeCollections,
    minPrice,
    maxPrice,
    activeCount:
      activeCategories.length +
      activeMoods.length +
      activeCollections.length +
      (minPrice ? 1 : 0) +
      (maxPrice ? 1 : 0),
    toggleParam,
    setSingle,
    clearAll,
  };
}
