/**
 * Cart service — real backend integration.
 *
 * Every call goes through this app's same-origin `/api/cart` Route Handlers.
 * Those handlers read the HttpOnly session cookie and forward the backend JWT
 * as a Bearer token, so the token never reaches client-side JavaScript.
 *
 * Request handling (fetch, JSON, network mapping) comes from
 * `lib/api-client.ts`; payload shapes come from `types/cart.ts`.
 */

import {
  NETWORK_ERROR_MESSAGE,
  apiPostBody,
  apiRequest,
  readRouteBody,
} from "@/lib/api-client";
import type {
  ApiCart,
  ApiCartItem,
  CartFailureReason,
  CartResult,
} from "@/types/cart";

function coerceCartItem(value: unknown): ApiCartItem | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.productId !== "string" || !record.productId.trim()) return null;
  if (typeof record.name !== "string") return null;
  if (typeof record.price !== "number" || !Number.isFinite(record.price)) return null;
  if (typeof record.qty !== "number" || !Number.isInteger(record.qty) || record.qty <= 0) {
    return null;
  }

  const lineTotal =
    typeof record.lineTotal === "number" && Number.isFinite(record.lineTotal)
      ? record.lineTotal
      : record.price * record.qty;

  return {
    productId: record.productId,
    name: record.name,
    price: record.price,
    qty: record.qty,
    size: typeof record.size === "string" && record.size ? record.size : undefined,
    lineTotal,
    isActive: record.isActive !== false,
  };
}

/** Defensively coerces the backend's `data` payload into a cart. */
function coerceCart(value: unknown): ApiCart | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const rawItems = Array.isArray(record.items) ? record.items : [];
  const items = rawItems
    .map(coerceCartItem)
    .filter((item): item is ApiCartItem => item !== null);

  const total =
    typeof record.total === "number" && Number.isFinite(record.total)
      ? record.total
      : items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: typeof record.id === "string" ? record.id : null,
    items,
    count: items.length,
    total,
  };
}

function failureReason(status: number, message: string): CartFailureReason {
  if (status === 401) return "unauthorized";
  if (status === 404) return "not-found";
  if (status === 400) return "invalid";
  if (status === 409) {
    const normalized = message.toLowerCase();
    if (normalized.includes("stock")) return "stock";
    if (normalized.includes("already in cart")) return "duplicate";
    return "conflict";
  }
  if (status >= 500) return "server";
  return "conflict";
}

async function readCartResponse(
  response: Response | null,
  fallbackError: string,
): Promise<CartResult> {
  if (!response) {
    return {
      ok: false,
      error: NETWORK_ERROR_MESSAGE,
      status: 0,
      reason: "network",
    };
  }

  const body = await readRouteBody(response, fallbackError);
  if (body.ok !== true) {
    const message = typeof body.error === "string" ? body.error : fallbackError;
    const unauthorized = body.unauthorized === true || response.status === 401;
    return {
      ok: false,
      error: message,
      status: response.status,
      reason: unauthorized ? "unauthorized" : failureReason(response.status, message),
      unauthorized,
    };
  }

  const cart = coerceCart(body.data);
  if (!cart) {
    return {
      ok: false,
      error: "The bag response was incomplete — please try again.",
      status: response.status,
      reason: "server",
    };
  }

  return { ok: true, cart };
}

/** `GET /api/cart` — the signed-in customer's server-side cart. */
export async function getCart(): Promise<CartResult> {
  const response = await apiRequest("/cart", { cache: "no-store" });
  return readCartResponse(response, "Failed to load your bag.");
}

/**
 * `POST /api/cart/items` — adds one product. The backend rejects duplicates,
 * inactive products and quantities above current stock.
 */
export async function addCartItem(
  productId: string,
  qty: number,
  size?: string,
): Promise<CartResult> {
  const response = await apiPostBody("/cart/items", {
    productId,
    qty,
    ...(size ? { size } : {}),
  });
  return readCartResponse(response, "Failed to add this piece to your bag.");
}

/** `PUT /api/cart/items/:productId` — sets the absolute quantity/size. */
export async function updateCartItem(
  productId: string,
  qty: number,
  size?: string,
): Promise<CartResult> {
  const response = await apiRequest(
    `/cart/items/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty, ...(size ? { size } : {}) }),
    },
  );
  return readCartResponse(response, "Failed to update this piece.");
}

/** `DELETE /api/cart/items/:productId` — removes one line. */
export async function removeCartItem(productId: string): Promise<CartResult> {
  const response = await apiRequest(
    `/cart/items/${encodeURIComponent(productId)}`,
    { method: "DELETE" },
  );
  return readCartResponse(response, "Failed to remove this piece.");
}

/** `DELETE /api/cart` — clears every line (idempotent on the backend). */
export async function clearCartRequest(): Promise<CartResult> {
  const response = await apiRequest("/cart", { method: "DELETE" });
  return readCartResponse(response, "Failed to clear your bag.");
}
