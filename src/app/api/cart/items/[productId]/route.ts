import { cartBackend, cartProxyResponse } from "@/lib/server-cart";

/**
 * PUT /api/cart/items/:productId — sets the quantity for one line.
 * DELETE /api/cart/items/:productId — removes one line.
 *
 * The product id is forwarded as a path segment; backend stock and activity
 * rules remain authoritative.
 */

type CartItemContext = { params: Promise<{ productId: string }> };

export async function PUT(request: Request, context: CartItemContext) {
  const { productId } = await context.params;

  let payload: { qty?: unknown; size?: unknown };
  try {
    payload = (await request.json()) as { qty?: unknown; size?: unknown };
  } catch {
    return Response.json(
      { ok: false, error: "Please choose a valid quantity." },
      { status: 400 },
    );
  }

  if (
    typeof payload.qty !== "number" ||
    !Number.isInteger(payload.qty) ||
    payload.qty <= 0
  ) {
    return Response.json(
      { ok: false, error: "Quantity must be a positive whole number." },
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
    await cartBackend(`/items/${encodeURIComponent(productId)}`, {
      method: "PUT",
      body: JSON.stringify({
        qty: payload.qty,
        ...(typeof payload.size === "string" && payload.size.trim()
          ? { size: payload.size.trim() }
          : {}),
      }),
    }),
    "Failed to update this piece.",
  );
}

export async function DELETE(_request: Request, context: CartItemContext) {
  const { productId } = await context.params;

  return cartProxyResponse(
    await cartBackend(`/items/${encodeURIComponent(productId)}`, {
      method: "DELETE",
    }),
    "Failed to remove this piece.",
  );
}
