import { backendMessage, backendPost } from "@/lib/server-auth";

/**
 * POST /api/auth/resend-verification — proxies the backend resend.
 *
 * The backend answers generically (never revealing whether the email exists
 * or is verified) and rate-limits to 5 per hour. The interpolated body is
 * forwarded to the form so it can render a status without asserting anything
 * the backend did not say.
 */
export async function POST(request: Request) {
  let payload: { email?: unknown };
  try {
    payload = (await request.json()) as { email?: unknown };
  } catch {
    return Response.json({ ok: false, error: "Please try again." }, { status: 400 });
  }
  if (typeof payload.email !== "string") {
    return Response.json(
      { ok: false, error: "An email address is required." },
      { status: 400 },
    );
  }

  const backend = await backendPost("/resend-verification", {
    email: payload.email,
  });

  if (!backend) {
    return Response.json(
      { ok: false, error: "We could not reach the boutique — please try again." },
      { status: 502 },
    );
  }

  if (backend.body.success) {
    return Response.json({
      ok: true,
      message: backendMessage(
        backend.body,
        "If an account with that email exists and is unverified, a new verification email will be sent.",
      ),
    });
  }

  // Validation (400) or rate limit (429) — forward the status + message.
  return Response.json(
    {
      ok: false,
      error: backendMessage(
        backend.body,
        "Too many verification requests — please try again later.",
      ),
    },
    { status: backend.status >= 500 ? 502 : backend.status === 429 ? 429 : 400 },
  );
}
