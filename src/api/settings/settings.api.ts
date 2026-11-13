/**
 * Settings service — public checkout pricing rules.
 *
 * The backend exposes shipping and tax configuration at
 * `GET /api/settings/checkout` (no authentication). Requests go through this
 * app's same-origin Route Handler so the client has one API surface to talk to.
 */

import {
  NETWORK_ERROR_MESSAGE,
  apiRequest,
  readRouteBody,
} from "@/lib/api-client";
import type { CheckoutSettings } from "@/types/settings";

export type CheckoutSettingsResult =
  | { ok: true; settings: CheckoutSettings }
  | { ok: false; error: string };

function nonNegative(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function coerceSettings(value: unknown): CheckoutSettings | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const shipping = record.shipping;
  const tax = record.tax;
  if (!shipping || typeof shipping !== "object") return null;
  if (!tax || typeof tax !== "object") return null;

  const shippingRecord = shipping as Record<string, unknown>;
  const taxRecord = tax as Record<string, unknown>;

  const flatRate = nonNegative(shippingRecord.flatRate);
  const ratePercent = nonNegative(taxRecord.ratePercent);
  if (flatRate === null || ratePercent === null || ratePercent > 100) {
    return null;
  }

  const rawThreshold = shippingRecord.freeShippingThreshold;
  const freeShippingThreshold =
    rawThreshold === null ? null : nonNegative(rawThreshold);
  if (rawThreshold !== null && freeShippingThreshold === null) return null;

  return {
    shipping: {
      flatRate,
      freeShippingThreshold,
    },
    tax: {
      ratePercent,
    },
  };
}

/** `GET /api/settings/checkout` — live shipping and tax rules. */
export async function getCheckoutSettings(): Promise<CheckoutSettingsResult> {
  const response = await apiRequest("/settings/checkout", {
    cache: "no-store",
  });

  if (!response) {
    return { ok: false, error: NETWORK_ERROR_MESSAGE };
  }

  const body = await readRouteBody(
    response,
    "Failed to load checkout settings.",
  );
  if (body.ok !== true) {
    return {
      ok: false,
      error:
        typeof body.error === "string"
          ? body.error
          : "Failed to load checkout settings.",
    };
  }

  const settings = coerceSettings(body.data);
  if (!settings) {
    return {
      ok: false,
      error: "The checkout settings response was incomplete.",
    };
  }

  return { ok: true, settings };
}
