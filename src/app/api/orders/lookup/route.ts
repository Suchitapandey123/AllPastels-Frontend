import { backendApi, backendProxyResponse } from "@/lib/server-api";

/**
 * POST /api/orders/lookup — secure guest order lookup.
 *
 * Guests prove ownership with the order number and the email used at checkout.
 * The backend applies rate limiting and returns a generic 404 for both unknown
 * orders and mismatched emails, preventing order-number enumeration.
 */

interface LookupPayload {
  orderNumber?: unknown;
  email?: unknown;
}

export async function POST(request: Request) {
  let payload: LookupPayload;
  try {
    payload = (await request.json()) as LookupPayload;
  } catch {
    return Response.json(
      { ok: false, error: "Please enter your order number and email." },
      { status: 400 },
    );
  }

  if (
    typeof payload.orderNumber !== "string" ||
    !/^AP-\d{5}$/.test(payload.orderNumber.trim()) ||
    typeof payload.email !== "string" ||
    !payload.email.trim()
  ) {
    return Response.json(
      { ok: false, error: "Please enter a valid order number and email." },
      { status: 400 },
    );
  }

  return backendProxyResponse(
    await backendApi(
      "/orders/lookup",
      {
        method: "POST",
        body: JSON.stringify({
          orderNumber: payload.orderNumber.trim(),
          email: payload.email.trim(),
        }),
      },
      "none",
    ),
    "We could not find that order.",
  );
}
