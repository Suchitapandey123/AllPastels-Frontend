import { cartBackend, cartProxyResponse } from "@/lib/server-cart";

/**
 * POST /api/cart/items — adds a product to the authenticated customer's cart.
 * The backend validates product activity and stock; the client never supplies
 * prices.
 */

export async function POST(request: Request) {
  let payload: { productId?: unknown; qty?: unknown; size?: unknown };
  try {
    payload = (await request.json()) as {
      productId?: unknown;
      qty?: unknown;
      size?: unknown;
    };
  } catch {
    return Response.json(
      { ok: false, error: "Please choose a product and quantity." },
      { status: 400 },
    );
  }

  if (
    typeof payload.productId !== "string" ||
    !payload.productId.trim() ||
    typeof payload.qty !== "number" ||
    !Number.isInteger(payload.qty) ||
    payload.qty <= 0
  ) {
    return Response.json(
      { ok: false, error: "A valid product and positive quantity are required." },
      { status: 400 },
    );
  }

  if (
    payload.size !== undefined &&
    (typeof payload.size !== "string" || payload.size.length > 40)
  ) {
    return Response.json(
      { ok: false, error: "Please choose a valid size." },
      { status: 400 },
    );
  }

  return cartProxyResponse(
    await cartBackend("/items", {
      method: "POST",
      body: JSON.stringify({
        productId: payload.productId,
        qty: payload.qty,
        ...(typeof payload.size === "string" && payload.size.trim()
          ? { size: payload.size.trim() }
          : {}),
      }),
    }),
    "Failed to add this piece to your bag.",
  );
}
