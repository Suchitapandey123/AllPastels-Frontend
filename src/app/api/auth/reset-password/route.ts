import { backendMessage, backendPost } from "@/lib/server-auth";

/**
 * POST /api/auth/reset-password — proxies the backend reset.
 *
 * The single-use token from a reset link plus the new password; the backend
 * validates the token server-side. The token is forwarded and then dropped —
 * never logged or echoed back.
 */
export async function POST(request: Request) {
  let payload: { token?: unknown; newPassword?: unknown };
  try {
    payload = (await request.json()) as { token?: unknown; newPassword?: unknown };
  } catch {
    return Response.json({ ok: false, error: "Please try again." }, { status: 400 });
  }
  if (typeof payload.token !== "string" || typeof payload.newPassword !== "string") {
    return Response.json(
      { ok: false, error: "A request with a valid link is required." },
      { status: 400 },
    );
  }

  const backend = await backendPost("/reset-password", {
    token: payload.token,
    newPassword: payload.newPassword,
  });

  if (!backend) {
    return Response.json(
      { ok: false, error: "We could not reach the boutique — please try again." },
      { status: 502 },
    );
  }

  if (backend.body.success) {
    return Response.json({ ok: true });
  }

  return Response.json(
    {
      ok: false,
      error: backendMessage(
        backend.body,
        "That reset link is invalid or has expired — request a new one.",
      ),
    },
    { status: backend.status >= 500 ? 502 : 400 },
  );
}
