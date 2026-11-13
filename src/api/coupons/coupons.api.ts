/**
 * Coupons service — storefront-side helpers.
 *
 * Coupon codes are priced authoritatively by the checkout routes when an order
 * is placed. Checkout may also call the public order-preview endpoint to show
 * a live discount; its result is only an estimate. Client code here just
 * normalises the code it submits.
 */

export const COUPON_CODE_MAX_LENGTH = 30;

/** Matches the backend's checkout handling: trimmed and upper-cased. */
export function normalizeCouponCode(value: string): string {
  return value.trim().toUpperCase();
}
