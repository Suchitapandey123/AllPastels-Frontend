"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * useReducedMotion — tracks the `prefers-reduced-motion` media query.
 *
 * Built on `useSyncExternalStore` so the browser's media query *is* the
 * source of truth. This avoids the classic setState-in-effect anti-pattern
 * (an extra render on every mount) and automatically stays correct if the
 * user flips the OS accessibility setting while the page is open.
 *
 * Server snapshot is `true`, so the very first client render already
 * matches the server and React reports no hydration mismatch.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function useReducedMotion(): boolean {
  const getSnapshot = useCallback(() => window.matchMedia(QUERY).matches, []);
  // Assume reduced motion during SSR and the first paint.
  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
