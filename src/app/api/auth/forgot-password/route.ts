import { backendMessage, backendPost, isEmailSent } from "@/lib/server-auth";

/**
 * POST /api/auth/forgot-password — proxies the backend request.
 *
 * The backend generates a single-use, expiring reset token, stores only its
 * hash and (when SMTP is configured) emails the reset link. Its response is
 * deliberately generic so it never reveals whether an account exists; that
 * message plus the `emailSent` delivery flag are forwarded verbatim.
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

  const backend = await backendPost("/forgot-password", {
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
        "If an account with that email exists, a password reset link has been sent.",
      ),
      emailSent: isEmailSent(backend.body),
    });
  }

  return Response.json(
    {
      ok: false,
      error: backendMessage(backend.body, "Request did not go through — please try again."),
    },
    { status: backend.status >= 500 ? 502 : 400 },
  );
}
