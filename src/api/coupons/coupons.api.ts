/**
 * Coupons service — storefront-side helpers.
 *
 * The backend has no public coupon-validation endpoint: coupon codes are
 * validated and priced exclusively by the checkout routes when an order is
 * placed. Client code therefore only normalises the code it submits.
 */

export const COUPON_CODE_MAX_LENGTH = 30;

/** Matches the backend's checkout handling: trimmed and upper-cased. */
export function normalizeCouponCode(value: string): string {
  return value.trim().toUpperCase();
}
