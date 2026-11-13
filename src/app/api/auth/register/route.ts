import { backendMessage, backendPost, isEmailSent } from "@/lib/server-auth";

/**
 * POST /api/auth/register — proxies the backend registration.
 *
 * The backend returns `emailSent` (false when SMTP is down or
 * unconfigured); that flag is forwarded verbatim — the UI must not claim a
 * verification email went out unless the backend sent `emailSent: true`.
 */
export async function POST(request: Request) {
  let payload: { name?: unknown; email?: unknown; password?: unknown };
  try {
    payload = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };
  } catch {
    return Response.json({ ok: false, error: "Please try again." }, { status: 400 });
  }
  if (
    typeof payload.name !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.password !== "string"
  ) {
    return Response.json(
      { ok: false, error: "Name, email and password are required." },
      { status: 400 },
    );
  }

  const backend = await backendPost("/register", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
  });

  if (!backend) {
    return Response.json(
      { ok: false, error: "We could not reach the boutique — please try again." },
      { status: 502 },
    );
  }

  if (backend.status === 201 && backend.body.success) {
    return Response.json({
      ok: true,
      emailSent: isEmailSent(backend.body),
      message: backendMessage(
        backend.body,
        "Registration successful. Please check your email to verify your account.",
      ),
    });
  }

  // 400 validation / 409 duplicate email are useful to display; 5xx stays
  // generic and retryable.
  if (backend.status >= 500) {
    return Response.json(
      {
        ok: false,
        error: "Registration did not go through — please try again.",
      },
      { status: 502 },
    );
  }

  return Response.json(
    {
      ok: false,
      error: backendMessage(backend.body, "Registration did not go through."),
    },
    { status: backend.status === 503 ? 503 : 400 },
  );
}
