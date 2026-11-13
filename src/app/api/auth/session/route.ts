import { fetchCurrentUser } from "@/lib/server-auth";

/**
 * GET /api/auth/session — restores the authenticated customer session.
 *
 * Reads the HttpOnly token cookie, calls backend `GET /api/auth/me` with the
 * JWT as a Bearer token, and returns the profile when the token is still
 * valid. An invalid cookie maps to 401 so the client clears its stale
 * session record; no token ever reaches client-side JavaScript.
 */
export async function GET() {
  const user = await fetchCurrentUser();
  if (!user) {
    return Response.json(
      { ok: false, error: "No active session." },
      { status: 401 },
    );
  }
  return Response.json({ ok: true, user });
}
