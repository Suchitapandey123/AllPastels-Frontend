import { backendApi, backendProxyResponse } from "@/lib/server-api";

/**
 * POST /api/orders/preview — prices a bag with an optional coupon without
 * creating an order. The backend validates the coupon and computes every
 * amount from database values, so client-supplied totals can never leak in.
 */

interface PreviewPayload {
  items?: unknown;
  couponCode?: unknown;
}

const MAX_PREVIEW_ITEMS = 100;

export async function POST(request: Request) {
  let payload: PreviewPayload;
  try {
    payload = (await request.json()) as PreviewPayload;
  } catch {
    return Response.json(
      { ok: false, error: "Your bag could not be read. Please try again." },
      { status: 400 },
    );
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return Response.json(
      { ok: false, error: "Your bag is empty." },
      { status: 400 },
    );
  }

  if (payload.items.length > MAX_PREVIEW_ITEMS) {
    return Response.json(
      { ok: false, error: "Your bag has too many different items." },
      { status: 400 },
    );
  }

  const items: { productId: string; qty: number; size?: string }[] = [];
  for (const value of payload.items) {
    if (!value || typeof value !== "object") {
      return Response.json(
        { ok: false, error: "One of the items in your bag is invalid." },
        { status: 400 },
      );
    }

    const item = value as Record<string, unknown>;
    if (
      typeof item.productId !== "string" ||
      !item.productId ||
      typeof item.qty !== "number" ||
      !Number.isInteger(item.qty) ||
      item.qty <= 0
    ) {
      return Response.json(
        { ok: false, error: "One of the items in your bag is invalid." },
        { status: 400 },
      );
    }

    if (
      item.size !== undefined &&
      (typeof item.size !== "string" || item.size.length > 40)
    ) {
      return Response.json(
        { ok: false, error: "One of the item sizes is invalid." },
        { status: 400 },
      );
    }

    const line: { productId: string; qty: number; size?: string } = {
      productId: item.productId,
      qty: item.qty,
    };
    if (typeof item.size === "string" && item.size.trim()) {
      line.size = item.size.trim();
    }
    items.push(line);
  }

  const forwarded: {
    items: { productId: string; qty: number; size?: string }[];
    couponCode?: string;
  } = { items };

  if (payload.couponCode !== undefined) {
    if (typeof payload.couponCode !== "string") {
      return Response.json(
        { ok: false, error: "Invalid coupon code." },
        { status: 400 },
      );
    }
    if (payload.couponCode.trim()) {
      forwarded.couponCode = payload.couponCode;
    }
  }

  return backendProxyResponse(
    await backendApi(
      "/orders/preview",
      {
        method: "POST",
        body: JSON.stringify(forwarded),
      },
      "optional",
    ),
    "Failed to check this coupon.",
  );
}
