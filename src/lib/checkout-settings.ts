import { FREE_SHIPPING_THRESHOLD } from "@/data/site";
import type { CheckoutSettings } from "@/types/settings";

/**
 * Pricing helpers for the pre-order estimate.
 *
 * The backend remains authoritative: these values are only used to quote the
 * cart and checkout before an order is placed. If settings cannot be loaded,
 * the storefront falls back to the values the UI shipped with so it never
 * blocks a customer from checking out.
 */

export const FALLBACK_CHECKOUT_SETTINGS: CheckoutSettings = {
  shipping: {
    flatRate: 99,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  },
  tax: {
    ratePercent: 0,
  },
};

export interface ShippingQuote {
  flatRate: number;
  freeShippingThreshold: number | null;
  shipping: number;
  free: boolean;
  /** True when a spend threshold can waive a non-zero flat rate. */
  hasFreeShippingTier: boolean;
  remaining: number;
  progress: number;
}

export function quoteShipping(
  settings: CheckoutSettings | null,
  subtotal: number,
): ShippingQuote {
  const resolved = settings ?? FALLBACK_CHECKOUT_SETTINGS;
  const flatRate = Math.max(0, resolved.shipping.flatRate);
  const threshold =
    resolved.shipping.freeShippingThreshold === null
      ? null
      : Math.max(0, resolved.shipping.freeShippingThreshold);

  const hasFreeShippingTier = threshold !== null && flatRate > 0;
  const qualifies = threshold !== null && subtotal >= threshold;
  const shipping = qualifies ? 0 : flatRate;
  const remaining =
    threshold !== null ? Math.max(0, threshold - subtotal) : 0;
  const progress =
    threshold !== null && threshold > 0
      ? Math.min(100, (subtotal / threshold) * 100)
      : 100;

  return {
    flatRate,
    freeShippingThreshold: threshold,
    shipping,
    free: shipping === 0,
    hasFreeShippingTier,
    remaining,
    progress,
  };
}

export interface TaxQuote {
  ratePercent: number;
  amount: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Estimates tax on the merchandise amount. Coupon discounts are applied by the
 * backend at order time, so the estimate never assumes one.
 */
export function quoteTax(
  settings: CheckoutSettings | null,
  subtotal: number,
  discount = 0,
): TaxQuote {
  const ratePercent = settings
    ? Math.min(100, Math.max(0, settings.tax.ratePercent))
    : 0;
  const net = Math.max(0, subtotal - discount);
  return {
    ratePercent,
    amount: round2((net * ratePercent) / 100),
  };
}
