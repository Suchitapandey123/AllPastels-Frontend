import { clearSessionCookie } from "@/lib/server-auth";

/**
 * POST /api/auth/logout — clears the session cookie. The backend holds no
 * token revocation endpoint, so expiry does the rest server-side.
 */
export async function POST() {
  await clearSessionCookie();
  return Response.json({ ok: true });
}
