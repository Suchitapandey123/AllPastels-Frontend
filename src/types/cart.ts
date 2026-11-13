/**
 * Shared cart domain types.
 *
 * `ApiCart` mirrors the backend cart payload returned by the cart routes in
 * `allpastels-backend/routes/cart.js`. The backend resolves prices from the
 * current Product document and stores only `{ productId, qty }` per line, so
 * the UI treats this shape as the source of truth for quantity and totals.
 */

export interface ApiCartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  lineTotal: number;
  isActive: boolean;
}

export interface ApiCart {
  id: string | null;
  items: ApiCartItem[];
  /** Number of distinct lines (the backend's own count). */
  count: number;
  /** Server-recalculated subtotal. */
  total: number;
}

export type CartFailureReason =
  | "unauthorized"
  | "stock"
  | "duplicate"
  | "not-found"
  | "invalid"
  | "network"
  | "server"
  | "conflict";

export type CartResult =
  | { ok: true; cart: ApiCart }
  | {
      ok: false;
      error: string;
      status: number;
      reason: CartFailureReason;
      unauthorized?: boolean;
    };

export type CartActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      reason: CartFailureReason;
      unauthorized?: boolean;
    };
