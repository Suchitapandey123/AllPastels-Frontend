/**
 * Shared frontend API client plumbing.
 *
 * Every service under `src/api/` funnels through here so request handling
 * (base URL, JSON encoding, network-failure mapping, shape of the
 * `{ ok, ... }` envelope returned by this app's Route Handlers) lives in one
 * place. The base URL points at the AllPastels backend via
 * `NEXT_PUBLIC_API_URL`, falling back to the local backend in development.
 *
 * Secrets policy: no JWT, token or password is ever stored client-side —
 * the login JWT lives in an HttpOnly cookie written by the
 * `src/app/api/auth/*` Route Handlers, and services call those same-origin
 * endpoints instead of the backend directly.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/** Shorthand for the browser-facing API surface of this app's Route Handlers. */
export const CLIENT_API_BASE = "/api";

/**
 * Common envelope produced by this app's Route Handlers. Values arrive as
 * `unknown` so callers coerce defensively — a malformed body must degrade
 * into a typed error, never a thrown exception in the UI.
 */
export interface ApiRouteBody {
  ok?: unknown;
  error?: unknown;
  message?: unknown;
  verificationRequired?: unknown;
  emailSent?: unknown;
  user?: unknown;
  data?: unknown;
  unauthorized?: unknown;
}

/** Generic fallback shown when the message-carrying request cannot ride out. */
export const NETWORK_ERROR_MESSAGE =
  "We could not reach the boutique — please try again.";

/**
 * Client fetch with uniform error handling: returns the Response on any
 * completed exchange, or `null` when the network itself failed (DNS, offline,
 * aborted). Service functions translate that into their own typed results.
 */
export async function apiRequest(
  path: string,
  init?: RequestInit,
): Promise<Response | null> {
  try {
    return await fetch(`${CLIENT_API_BASE}${path}`, init);
  } catch {
    return null;
  }
}

/** JSON POST through `apiRequest`, the common case for mutation calls. */
export async function apiPostBody(
  path: string,
  body: unknown,
): Promise<Response | null> {
  return apiRequest(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Parses a Route Handler's JSON body defensively. If the body carries no
 * usable string for `error`, the caller's fallback is substituted so the UI
 * always has a message to render.
 */
export async function readRouteBody(
  response: Response,
  fallbackError: string,
): Promise<ApiRouteBody> {
  const body = (await response
    .json()
    .catch(() => ({}))) as ApiRouteBody | void;
  if (!body || typeof body !== "object") {
    return { ok: false, error: fallbackError };
  }
  if (typeof body.error !== "string") body.error = fallbackError;
  return body;
}
