import type { ImageSlot, ProductImageSet } from "@/lib/images";

/**
 * Domain types for the AllPastels storefront.
 *
 * These mirror the shape a real commerce API would return, so swapping the
 * mock data modules for `fetch()` calls later requires no UI changes.
 */

export type CategoryId = "women" | "men" | "kids" | "accessories";

/**
 * Occasions a product can be shopped for.
 *
 * The five headline moods (everyday, weekend, party, vacation, festive) map
 * to the "Shop by mood" section; work and travel are the two extra lenses
 * exposed through occasion-based discovery.
 */
export type MoodId =
  | "everyday"
  | "weekend"
  | "party"
  | "vacation"
  | "festive"
  | "work"
  | "travel";

export type DiscoveryId = "gifting" | "everyday" | "work" | "travel" | "celebration";

export interface ColorOption {
  name: string;
  /** CSS colour value for the swatch. */
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Primary category, used for routing and faceted filtering. */
  category: CategoryId;
  /** Human-readable category label, e.g. "Dresses". */
  categoryLabel: string;
  price: number;
  /** Original price when the item is reduced; omitted otherwise. */
  compareAtPrice?: number;
  /** Photo set key from `src/lib/images.ts`. */
  photoSet: ProductImageSet;
  /** Backend image URLs (preferred over `photoSet` when present). */
  images?: string[];
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  /** SEO overrides from the backend; empty/undefined falls back to defaults. */
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  /** Alt text for the product's gallery images. */
  imageAlt?: string;
  colors: ColorOption[];
  sizes: string[];
  /** Short line shown on cards and in search results. */
  summary: string;
  /** Full description for the product page. */
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  moods: MoodId[];
  collections: string[];
  /** Optional merchandising label, e.g. "Only 4 left". */
  badge?: string;
}

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  href: string;
  imageSlot: ImageSlot;
  productCount: number;
}

export interface Mood {
  id: MoodId;
  title: string;
  description: string;
  href: string;
  imageSlot: ImageSlot;
}

export interface Discovery {
  id: DiscoveryId;
  title: string;
  description: string;
  href: string;
  imageSlot: ImageSlot;
}

export interface Collection {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  imageSlot: ImageSlot;
  productSlugs: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  /** Product the reviewer bought, when relevant. */
  productSlug?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

