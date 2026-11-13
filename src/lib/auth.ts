/**
 * Auth helpers — pure functions shared by the login, signup and account UIs.
 *
 * Kept framework-free so they can be unit-tested (or swapped for server-side
 * validation) without touching any component.
 */

/** Basic email shape check — the server would still verify. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Password strength on a 0-4 scale:
 * 0 too short · 1 weak · 2 fair · 3 good · 4 strong.
 */
export function passwordStrength(password: string): number {
  if (password.length < 6) return 0;

  let score = 1;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^\w\s]/.test(password)) score += 1;
  return Math.min(score, 4);
}

/** Label shown beside the strength meter for each score. */
export const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

/** Initials for the monogram avatar, e.g. "Aarav Patel" -> "AP". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
