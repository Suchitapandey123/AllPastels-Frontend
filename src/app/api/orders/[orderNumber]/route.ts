import { backendApi, backendProxyResponse } from "@/lib/server-api";

/**
 * GET /api/orders/:orderNumber — owner or admin order detail.
 *
 * The backend also preserves the legacy guest detail-by-order-number route;
 * the secure guest UI uses POST /api/orders/lookup instead.
 */

type OrderContext = { params: Promise<{ orderNumber: string }> };

export async function GET(_request: Request, context: OrderContext) {
  const { orderNumber } = await context.params;

  if (!/^AP-\d{5}$/.test(orderNumber)) {
    return Response.json(
      { ok: false, error: "Invalid order number." },
      { status: 400 },
    );
  }

  return backendProxyResponse(
    await backendApi(
      `/orders/${encodeURIComponent(orderNumber)}`,
      { method: "GET" },
      "optional",
    ),
    "Failed to load this order.",
  );
}
