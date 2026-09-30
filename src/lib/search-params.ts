import type { FilterState, SortKey } from "@/lib/catalog";
import type { CategoryId } from "@/lib/types";

/**
 * Translates a page's `searchParams` into catalogue filter state.
 *
 * Listing pages read the URL on the server, so filters work without any
 * client JavaScript, stay shareable, and re-render correctly on a cold load.
 */

type RawSearchParams = Record<string, string | string[] | undefined>;

function toList(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  const list = (Array.isArray(value) ? value : [value]).filter(Boolean);
  return list.length > 0 ? list : undefined;
}

function toNumber(value: string | string[] | undefined): number | undefined {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toStringValue(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  return (Array.isArray(value) ? value[0] : value) || undefined;
}

export function buildFilterState(
  searchParams: RawSearchParams,
  overrides: Partial<FilterState> = {},
): FilterState {
  return {
    categories: toList(searchParams.category) as CategoryId[] | undefined,
    collections: toList(searchParams.collection),
    moods: toList(searchParams.mood),
    minPrice: toNumber(searchParams.min),
    maxPrice: toNumber(searchParams.max),
    search: toStringValue(searchParams.q),
    sort: toStringValue(searchParams.sort) as SortKey | undefined,
    ...overrides,
  };
}
