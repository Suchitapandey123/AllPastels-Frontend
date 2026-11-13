import {
  backendMessage,
  backendPost,
  coerceUser,
  setSessionCookie,
} from "@/lib/server-auth";

/**
 * POST /api/auth/login — proxies the backend login.
 *
 * Returns the user profile only; the JWT the backend hands back is written
 * to an HttpOnly cookie and never passed to client-side JavaScript. A 403
 * (email not verified) is forwarded with `verificationRequired: true` so the
 * sign-in form can offer a resend of the verification email.
 */

export async function POST(request: Request) {
  let payload: { email?: unknown; password?: unknown };
  try {
    payload = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return Response.json({ ok: false, error: "Please try again." }, { status: 400 });
  }
  if (typeof payload.email !== "string" || typeof payload.password !== "string") {
    return Response.json(
      { ok: false, error: "Email and password are required." },
      { status: 400 },
    );
  }

  const backend = await backendPost("/login", {
    email: payload.email,
    password: payload.password,
  });

  // Backend unreachable — retryable, no detail leaked.
  if (!backend) {
    return Response.json(
      { ok: false, error: "We could not reach the boutique — please try again." },
      { status: 502 },
    );
  }

  if (!backend.body.success || typeof backend.body.token !== "string") {
    const verificationRequired = backend.status === 403;
    return Response.json(
      {
        ok: false,
        verificationRequired,
        error: verificationRequired
          ? backendMessage(
              backend.body,
              "Please verify your email before logging in.",
            )
          : backendMessage(backend.body, "Email or password does not match."),
      },
      { status: backend.status === 429 ? 429 : backend.status >= 500 ? 502 : 400 },
    );
  }

  // Valid login: park the JWT in an HttpOnly cookie, hand the browser the
  // profile only.
  await setSessionCookie(backend.body.token);

  const user = coerceUser(backend.body.data) ?? {
    id: "",
    name: "",
    email: String(payload.email),
    isEmailVerified: true,
  };

  return Response.json({ ok: true, user });
}
