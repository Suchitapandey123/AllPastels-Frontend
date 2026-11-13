/**
 * Centralized public runtime configuration.
 *
 * Only `NEXT_PUBLIC_*` values belong here — they are inlined into the client
 * bundle by Next.js. Never add backend secrets (MongoDB URI, SMTP
 * credentials, JWT secret, etc.) to this module or to a `NEXT_PUBLIC_*`
 * variable.
 *
 * The value is read exactly once so browser services, Route Handlers and
 * server-side helpers all target the same backend.
 */

const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/** Express backend origin, without a trailing slash. */
export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");
