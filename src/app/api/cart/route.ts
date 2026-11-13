import { cartBackend, cartProxyResponse } from "@/lib/server-cart";

/**
 * GET /api/cart — returns the signed-in customer's cart with prices resolved
 * by the backend. DELETE /api/cart — clears every line.
 *
 * The HttpOnly session cookie is read server-side and sent to the backend as
 * a Bearer token; it never reaches client-side JavaScript.
 */

export async function GET() {
  return cartProxyResponse(
    await cartBackend("", { method: "GET" }),
    "Failed to load your bag.",
  );
}

export async function DELETE() {
  return cartProxyResponse(
    await cartBackend("", { method: "DELETE" }),
    "Failed to clear your bag.",
  );
}
