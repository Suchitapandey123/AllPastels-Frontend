import { products } from "@/data/products";
import type { CategoryId, Product } from "@/lib/types";

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

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((product) => product.collections.includes(collectionSlug));
}

export function getProductsByMood(mood: string): Product[] {
  return products.filter((product) => product.moods.includes(mood as never));
}

export function getNewArrivals(): Product[] {
  return sortProducts(
    products.filter((product) => product.isNew),
    "newest",
  );
}

export function getBestsellers(): Product[] {
  return sortProducts(products.filter((product) => product.isBestseller), "featured");
}

export function getOnSale(): Product[] {
  return sortProducts(
    products.filter((product) => typeof product.compareAtPrice === "number"),
    "featured",
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({
      candidate,
      // Rank by shared mood, then shared collection, then shared category.
      score:
        candidate.moods.filter((mood) => product.moods.includes(mood)).length * 3 +
        candidate.collections.filter((slug) => product.collections.includes(slug)).length * 2 +
        Number(candidate.category === product.category),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function searchProducts(term: string): Product[] {
  const trimmed = term.trim();
  if (!trimmed) return [];
  return queryProducts(products, { search: trimmed });
}
