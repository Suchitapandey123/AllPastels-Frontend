import { backendApi, backendProxyResponse } from "@/lib/server-api";

/**
 * GET /api/settings/checkout — proxies the backend's public shipping and tax
 * settings. Checkout still recomputes every amount server-side.
 */
export async function GET() {
  return backendProxyResponse(
    await backendApi("/settings/checkout", { method: "GET" }, "none"),
    "Failed to load checkout settings.",
  );
}
