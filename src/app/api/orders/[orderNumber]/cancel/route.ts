import { backendApi, backendProxyResponse } from "@/lib/server-api";

/**
 * POST /api/orders/:orderNumber/cancel — cancels one of the signed-in
 * customer's orders. The backend enforces ownership and the customer
 * cancellation rules, restores stock exactly once and returns the updated
 * order document.
 */

type CancelOrderContext = { params: Promise<{ orderNumber: string }> };

export async function POST(_request: Request, context: CancelOrderContext) {
  const { orderNumber } = await context.params;

  if (!/^AP-\d{5}$/.test(orderNumber)) {
    return Response.json(
      { ok: false, error: "Invalid order number." },
      { status: 400 },
    );
  }

  return backendProxyResponse(
    await backendApi(
      `/orders/${encodeURIComponent(orderNumber)}/cancel`,
      { method: "POST" },
      "required",
    ),
    "Failed to cancel this order.",
  );
}
