import type { Product } from "@/lib/types";

/**
 * Product Detail Experience — mock data layer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  FRONTEND ONLY. Nothing here talks to a server.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every function below is `async` and returns exactly the shape a real
 * endpoint would return. When the backend lands, each one becomes a `fetch`
 * (or SDK call) with the same signature:
 *
 *   fetchReviews(productId, page)     -> getReviews(product, page)
 *   postReview(productId, payload)    -> submitReview(product, input)
 *   fetchDelivery(productId, pincode) -> checkDelivery(product, pincode)
 *
 * Because the components only consume the *resolved* data, swapping the mock
 * for a real call never requires a UI change.
 */

/* ========================================================================== *
 * Types
 * ========================================================================== */

export interface Review {
  id: string;
  author: string;
  location: string;
  /** 1–5 */
  rating: number;
  title: string;
  body: string;
  /** ISO date string. */
  date: string;
  sizePurchased: string;
  /** Helpful-vote count, as a real reviews API would return. */
  helpful: number;
  verifiedPurchase: boolean;
}

export interface RatingBreakdown {
  /** Star value 1–5. */
  stars: number;
  /** Share of reviews at this star value, 0–100. */
  percent: number;
  count: number;
}

/* ========================================================================== *
 * Reviews — mock generator
 * ========================================================================== */

const REVIEW_POOL: Omit<Review, "id" | "date">[] = [
  {
    author: "Ananya R.",
    location: "Bengaluru",
    rating: 5,
    title: "Exactly the finish I was after",
    body: "The fabric has real weight to it and washes beautifully. I sized up for a looser fit and that was the right call — it reads relaxed without looking oversized.",
    sizePurchased: "M",
    helpful: 24,
    verifiedPurchase: true,
  },
  {
    author: "Meera S.",
    location: "Pune",
    rating: 4,
    title: "Lovely piece, size runs slightly large",
    body: "Quality is genuinely good for the price and it arrived in two days. Taking one star off only because I'm a size down from my usual and it sits looser than I expected.",
    sizePurchased: "S",
    helpful: 11,
    verifiedPurchase: true,
  },
  {
    author: "Farhan K.",
    location: "Hyderabad",
    rating: 5,
    title: "Third one I've bought",
    body: "I keep coming back to this because it's the rare piece that works for both office and an evening out. No shrinkage after four washes so far.",
    sizePurchased: "L",
    helpful: 38,
    verifiedPurchase: true,
  },
  {
    author: "Divya N.",
    location: "Chennai",
    rating: 4,
    title: "Beautiful colour, true to the photos",
    body: "The shade matched the product photos exactly in daylight. Delivery was quick and the packaging felt considered rather than plastic-y.",
    sizePurchased: "M",
    helpful: 7,
    verifiedPurchase: true,
  },
  {
    author: "Rohit V.",
    location: "Mumbai",
    rating: 3,
    title: "Good, but check the measurements",
    body: "Nothing wrong with the make — I just ordered my usual size out of habit and should have measured first. Their size guide was accurate once I used it.",
    sizePurchased: "XL",
    helpful: 15,
    verifiedPurchase: false,
  },
];

/** Stable pseudo-random so server and client renders never disagree. */
function seeded(seed: string): number {
  let hash = 7;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  return hash;
}

function offsetDays(days: number): string {
  const base = Date.UTC(2025, 8, 1);
  return new Date(base - days * 86400000).toISOString().slice(0, 10);
}

/**
 * Builds a plausible star distribution that always totals 100% and whose
 * weighted mean lands close to the product's real `rating`.
 */
function buildBreakdown(rating: number, total: number): RatingBreakdown[] {
  const weights = [
    Math.max(0.2, (rating - 2.6) * 2.6), // 5 star
    Math.max(0.4, 3.4 - rating), // 4 star
    Math.max(0.15, 1.9 - rating / 1.6), // 3 star
    0.14, // 2 star
    Math.max(0.04, 1.5 - rating / 1.5), // 1 star
  ];
  const sum = weights.reduce((a, b) => a + b, 0);

  const floors = weights
    .map((w, index) => {
      const exact = (w / sum) * total;
      const floored = Math.floor(exact);
      return { stars: 5 - index, count: floored, remainder: exact - floored };
    })
    .sort((a, b) => b.stars - a.stars);

  // Largest-remainder allocation keeps the counts summing exactly to `total`.
  let used = floors.reduce((sum2, entry) => sum2 + entry.count, 0);
  let cursor = 0;
  while (used < total && cursor < floors.length * 4) {
    floors[cursor % floors.length].count += 1;
    used += 1;
    cursor += 1;
  }

  return floors.map((entry) => ({
    stars: entry.stars,
    count: entry.count,
    percent: total === 0 ? 0 : Math.round((entry.count / total) * 100),
  }));
}

/**
 * MOCK reviews endpoint.
 *
 * → `GET /api/products/:id/reviews?page=1`
 */
export async function getReviews(product: Product, page = 1): Promise<ReviewsPayload> {
  const total = product.reviewCount;
  const size = 4;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(Math.max(1, page), pageCount);

  // Rotate the pool by a product-derived seed so different products get
  // different (but deterministic) reviews.
  const offset = seeded(product.id) % REVIEW_POOL.length;
  const rotated = [...REVIEW_POOL.slice(offset), ...REVIEW_POOL.slice(0, offset)];

  const start = (safePage - 1) * size;
  const available = Math.min(total, REVIEW_POOL.length);
  const reviews = rotated
    .slice(start, Math.min(start + size, available))
    .map((entry, index) => ({
      ...entry,
      id: `${product.id}-r${safePage}-${index}`,
      date: offsetDays((seeded(`${product.id}-${index}`) % 120) + 3),
    }));

  return {
    average: product.rating,
    total,
    breakdown: buildBreakdown(product.rating, total),
    reviews,
    pageCount,
  };
}

/**
 * MOCK review submission.
 *
 * → `POST /api/products/:id/reviews`
 *
 * NOTE: there is no persistence behind this. It resolves to the payload the
 * server *would* return so the UI can render an optimistic row, but nothing
 * is stored and the review disappears on reload. That is intentional until a
 * real endpoint exists.
 */
export async function submitReview(product: Product, input: NewReviewInput): Promise<Review> {
  return {
    id: `${product.id}-pending-${seeded(input.author + input.title) % 9999}`,
    author: input.author,
    location: "Your review",
    rating: input.rating,
    title: input.title,
    body: input.body,
    sizePurchased: input.sizePurchased,
    helpful: 0,
    verifiedPurchase: false,
    date: new Date().toISOString().slice(0, 10),
  };
}

/* ========================================================================== *
 * Size guide
 * ========================================================================== */

export interface SizeChartRow {
  size: string;
  /** Garment measurements in inches, keyed by the column header. */
  measurements: Record<string, string>;
}

export interface SizeChart {
  /** Column headers, e.g. "Bust (in)". */
  columns: string[];
  rows: SizeChartRow[];
  /** One-line fit note shown above the table. */
  fitNote: string;
}

const APPAREL_CHART: SizeChart = {
  columns: ["Bust", "Waist", "Hip"],
  rows: [
    { size: "XS", measurements: { Bust: "32", Waist: "26", Hip: "35" } },
    { size: "S", measurements: { Bust: "34", Waist: "28", Hip: "37" } },
    { size: "M", measurements: { Bust: "36", Waist: "30", Hip: "39" } },
    { size: "L", measurements: { Bust: "38", Waist: "32", Hip: "41" } },
    { size: "XL", measurements: { Bust: "41", Waist: "35", Hip: "44" } },
    { size: "XXL", measurements: { Bust: "44", Waist: "38", Hip: "47" } },
  ],
  fitNote: "Fits true to size with a relaxed drape. Size up for a looser look.",
};

const KIDS_CHART: SizeChart = {
  columns: ["Height", "Chest", "Waist"],
  rows: [
    { size: "2-3Y", measurements: { Height: "36", Chest: "21", Waist: "20" } },
    { size: "4-5Y", measurements: { Height: "40", Chest: "22", Waist: "21" } },
    { size: "6-7Y", measurements: { Height: "44", Chest: "23", Waist: "22" } },
    { size: "8-9Y", measurements: { Height: "48", Chest: "25", Waist: "23" } },
    { size: "10-11Y", measurements: { Height: "52", Chest: "26", Waist: "24" } },
  ],
  fitNote: "Cut with room to grow. Allow a little extra for layering.",
};

const ONE_SIZE_CHART: SizeChart = {
  columns: ["Length", "Width"],
  rows: [{ size: "One Size", measurements: { Length: "28", Width: "22" } }],
  fitNote: "One size fits most — adjust the tie or fastening to your shape.",
};

/**
 * Picks the right chart for a product. Static and synchronous today; a real
 * implementation would fetch per-SKU measurements, so this is the one seam to
 * replace when sizing data arrives from the backend.
 */
export function getSizeChart(product: Product): SizeChart {
  if (product.sizes.some((size) => /\d+Y/.test(size))) return KIDS_CHART;
  if (product.sizes.length === 1) return ONE_SIZE_CHART;
  return APPAREL_CHART;
}

export const FIT_TIPS: { title: string; body: string }[] = [
  {
    title: "Between two sizes?",
    body: "Size up. Our cuts are already relaxed through the body, so sizing up rarely looks oversized — it just removes any pulling at the shoulder or hip.",
  },
  {
    title: "Measuring properly",
    body: "Measure over a light layer, keep the tape level and snug but not tight, and measure where the garment actually sits on your body.",
  },
  {
    title: "Not sure between two?",
    body: "Our returns are free for 15 days, so the safest choice is the size you would normally wear. We also list the measurements on every piece.",
  },
];

/* ========================================================================== *
 * Delivery
 * ========================================================================== */

export interface DeliveryEstimate {
  /** e.g. "Fri, 19 Sep – Tue, 23 Sep" */
  window: string;
  /** Working days, e.g. "3–5" */
  days: string;
  city: string;
  /** Cash on delivery availability. */
  codAvailable: boolean;
  /** Whether this piece qualifies for free shipping. */
  freeShipping: boolean;
  /** Human-readable summary. */
  message: string;
}

/**
 * MOCK delivery lookup.
 *
 * → `GET /api/delivery?pincode=560001`
 *
 * Deterministic from the PIN code, so the same code always returns the same
 * answer and the component behaves consistently between renders. Returns
 * `null` for anything that is not a serviceable 6-digit code.
 */
export async function checkDelivery(
  product: Product,
  pincode: string,
): Promise<DeliveryEstimate | null> {
  const code = pincode.trim();
  if (!/^\d{6}$/.test(code)) return null;

  const city = CITY_BY_PREFIX[code.slice(0, 2)];
  if (!city) return null;

  // Deterministic 2–5 working day range derived from the digits.
  const spread = (Number(code[2]) % 4) + 2;
  const days = `${spread}–${spread + 2}`;

  const start = new Date();
  const end = new Date(start.getTime() + (spread + 2) * 86400000);
  const format = (date: Date) =>
    date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return {
    window: `${format(start)} – ${format(end)}`,
    days,
    city,
    codAvailable: Number(code[4]) % 2 === 0,
    freeShipping: product.price >= 2999,
    message: `Delivers to ${city} in ${days} working days.`,
  };
}

/** Representative metro prefixes so the mock returns something recognisable. */
const CITY_BY_PREFIX: Record<string, string> = {
  "11": "Delhi",
  "12": "Chandigarh",
  "20": "Jaipur",
  "30": "Kota",
  "38": "Pune",
  "40": "Mumbai",
  "50": "Hyderabad",
  "56": "Bengaluru",
  "60": "Chennai",
  "70": "Kolkata",
};

export interface ReviewsPayload {
  /** Mean rating across the product. */
  average: number;
  total: number;
  breakdown: RatingBreakdown[];
  reviews: Review[];
  /** Total pages available from the (future) paginated endpoint. */
  pageCount: number;
}

export interface NewReviewInput {
  author: string;
  rating: number;
  title: string;
  body: string;
  sizePurchased: string;
}