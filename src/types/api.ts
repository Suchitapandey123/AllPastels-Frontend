/**
 * Shared API transport types.
 *
 * The `{ ok, ... }` envelope is produced by this app's Route Handlers and
 * consumed by every browser-side service. Values stay `unknown` on purpose:
 * each domain coerces the payload it expects instead of trusting the wire
 * shape.
 */

export interface ApiRouteBody {
  ok?: unknown;
  error?: unknown;
  message?: unknown;
  verificationRequired?: unknown;
  emailSent?: unknown;
  user?: unknown;
  data?: unknown;
  summary?: unknown;
  unauthorized?: unknown;
}
