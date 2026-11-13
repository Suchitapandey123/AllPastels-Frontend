/**
 * Same-tab session notifications.
 *
 * The session store is intentionally private to `AuthProvider`. The cart store
 * only needs to know that the identity changed so it can reload the server-side
 * bag with the new (or cleared) HttpOnly cookie. This event is a notification,
 * not part of the authentication flow itself.
 */

export const SESSION_CHANGE_EVENT = "allpastels:session-change";

export function notifySessionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}
