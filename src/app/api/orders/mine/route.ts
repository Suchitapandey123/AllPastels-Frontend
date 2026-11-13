import { backendApi, backendProxyResponse } from "@/lib/server-api";

/** GET /api/orders/mine — the signed-in customer's order history. */
export async function GET() {
  return backendProxyResponse(
    await backendApi("/orders/mine", { method: "GET" }, "required"),
    "Failed to load your orders.",
  );
}
