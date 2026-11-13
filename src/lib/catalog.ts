import type { CategoryId, Product } from "@/lib/types";
import { toProduct } from "@/lib/product-adapter";
import { getAllProducts as apiGetAllProducts, getProductById as apiGetProductById } from "@/api";

/**
 * Read-side helpers over the mock catalogue.
 *
 * All listing pages route through these functions, so filtering and sorting
 * behave identically across /shop, category pages, search and collections.
 */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export interface FilterState {
  categories?: CategoryId[];
  collections?: string[];
  moods?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortKey;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

/** Absolute bounds used to seed the price filter UI. */
export const PRICE_BOUNDS = { min: 0, max: 8000 };

/** Price steps offered as quick-select filters. */
export const PRICE_STEPS = [2000, 3000, 4000, 5000] as const;

function matchesSearch(product: Product, term: string): boolean {
  const haystack = [
    product.name,
    product.summary,
    product.categoryLabel,
    product.category,
    ...product.colors.map((color) => color.name),
  ]
    .join(" ")
    .toLowerCase();

  return term
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function filterProducts(items: Product[], filters: FilterState): Product[] {
  const { categories, collections, moods, minPrice, maxPrice, search } = filters;

  return items.filter((product) => {
    if (categories?.length && !categories.includes(product.category)) return false;
    if (collections?.length && !collections.some((slug) => product.collections.includes(slug))) {
      return false;
    }
    if (moods?.length && !moods.some((mood) => product.moods.includes(mood as never))) return false;
    if (typeof minPrice === "number" && product.price < minPrice) return false;
    if (typeof maxPrice === "number" && product.price > maxPrice) return false;
    if (search && !matchesSearch(product, search)) return false;
    return true;
  });
}

export function sortProducts(items: Product[], sort: SortKey = "featured"): Product[] {
  const sorted = [...items];

  switch (sort) {
    case "newest":
      // New items float to the top; within each group, keep catalogue order.
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating,
      );
  }
}

/** Filter then sort — the single entry point every listing page uses. */
export function queryProducts(items: Product[], filters: FilterState = {}): Product[] {
  return sortProducts(filterProducts(items, filters), filters.sort);
}

export function getAllProducts(items: Product[] = []): Product[] {
  return items;
}

export function getProductBySlug(items: Product[], slug: string): Product | undefined {
  return items.find((product) => product.slug === slug || product.id === slug);
}

export function getProductsByCategory(items: Product[], category: CategoryId): Product[] {
  return items.filter((product) => product.category === category);
}

export function getProductsByCollection(items: Product[], collectionSlug: string): Product[] {
  return items.filter((product) => product.collections.includes(collectionSlug));
}

export function getProductsByMood(items: Product[], mood: string): Product[] {
  return items.filter((product) => product.moods.includes(mood as never));
}

export function getNewArrivals(items: Product[]): Product[] {
  return sortProducts(
    items.filter((product) => product.isNew),
    "newest",
  );
}

export function getBestsellers(items: Product[]): Product[] {
  return sortProducts(items.filter((product) => product.isBestseller), "featured");
}

export function getOnSale(items: Product[]): Product[] {
  return sortProducts(
    items.filter((product) => typeof product.compareAtPrice === "number"),
    "featured",
  );
}

export function getRelatedProducts(product: Product, items: Product[] = [], limit = 4): Product[] {
  const candidates = (items.length ? items : []).filter((candidate) => candidate.id !== product.id);
  return candidates
    .map((candidate) => ({
      candidate,
      score:
        candidate.moods.filter((mood) => product.moods.includes(mood)).length * 3 +
        candidate.collections.filter((slug) => product.collections.includes(slug)).length * 2 +
        Number(candidate.category === product.category),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function searchProducts(items: Product[], term: string): Product[] {
  const trimmed = term.trim();
  if (!trimmed) return [];
  return queryProducts(items, { search: trimmed });
}

/* ------------------------------------------------------------------ */
/* Async loaders over the real backend product API                     */
/* ------------------------------------------------------------------ */

export async function loadProducts(): Promise<
  { ok: true; products: Product[] } | { ok: false; error: string }
> {
  const result = await apiGetAllProducts();
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, products: result.products.map(toProduct) };
}

export async function loadProductById(
  id: string,
): Promise<{ ok: true; product: Product } | { ok: false; error: string; notFound?: boolean }> {
  const result = await apiGetProductById(id);
  if (!result.ok) return { ok: false, error: result.error, notFound: result.notFound };
  return { ok: true, product: toProduct(result.product) };
}
