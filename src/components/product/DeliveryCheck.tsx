"use client";

import { useState, type FormEvent } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { TruckIcon, CheckIcon } from "@/components/ui/icons";
import { quoteShipping } from "@/lib/checkout-settings";
import { checkDelivery, type DeliveryEstimate } from "@/lib/pdp-data";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * DeliveryCheck — "when does this reach me?".
 *
 * Lives directly under the buy box, where the question actually occurs.
 *
 * The PIN lookup is a pure front-end mock (`checkDelivery`), deliberately kept
 * behind a single async call so the real service slot in without touching this
 * component: replace the mock function's body with a `fetch` and the states,
 * validation and layout below are already correct.
 */
export function DeliveryCheck({ product }: { product: Product }) {
  const { checkoutSettings } = useStore();
  const shipping = quoteShipping(checkoutSettings, product.price);
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = pincode.trim();

    if (!code) {
      setError("Please enter your PIN code");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("Enter a valid 6-digit PIN code");
      return;
    }

    setError(null);
    setChecking(true);
    setUnavailable(false);

    const result = await checkDelivery(product, code);

    setChecking(false);
    if (result) {
      setEstimate(result);
    } else {
      setEstimate(null);
      setUnavailable(true);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="ap-eyebrow text-ink/45">Delivery</h3>

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <label htmlFor="ap-pincode" className="ap-body text-sm text-ink/70">
          Check delivery to your PIN code
        </label>

        <div className="mt-1.5 flex items-end gap-4">
          <input
            id="ap-pincode"
            name="pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            value={pincode}
            onChange={(event) => {
              // Digits only — prevents the error state from being reachable
              // by typing letters in the first place.
              setPincode(event.target.value.replace(/\D/g, ""));
              if (error) setError(null);
            }}
            placeholder="560001"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "ap-pincode-error" : undefined}
            className={`min-w-0 flex-1 border-b bg-transparent pb-2.5 text-sm tabular-nums text-ink transition-colors duration-300 placeholder:text-ink/30 focus:outline-none ${
              error ? "border-burnt" : "border-line focus:border-ink"
            }`}
          />
          <button
            type="submit"
            disabled={checking}
            className="ap-eyebrow shrink-0 pb-2.5 text-burnt underline underline-offset-4 transition-opacity duration-300 hover:opacity-70 disabled:opacity-50"
          >
            {checking ? "Checking" : "Check"}
          </button>
        </div>

        {error && (
          <p id="ap-pincode-error" role="alert" className="ap-body mt-2.5 text-xs text-burnt">
            {error}
          </p>
        )}
      </form>

      {unavailable && (
        <p
          role="status"
          className="ap-body mt-5 rounded-sm bg-cotton-900 px-5 py-3.5 text-sm text-ink/70"
        >
          We&apos;re not delivering to that PIN code yet. Try a metro PIN such as 560001
          (Bengaluru) or 400001 (Mumbai).
        </p>
      )}

      {estimate && (
        <div
          role="status"
          className="mt-5 rounded-sm bg-surface px-5 py-4"
        >
          <p className="flex items-start gap-3 text-sm text-ink">
            <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-burnt" />
            <span>
              <span className="font-medium">Arrives {estimate.window}</span>
              <span className="mt-1 block text-ink/65">
                {estimate.days} working days to {estimate.city}.
              </span>
            </span>
          </p>

          <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3.5 text-xs text-ink/65">
            <li className="flex items-center gap-1.5">
              <CheckIcon className="h-3.5 w-3.5 text-burnt" />
              {estimate.freeShipping || shipping.free
                ? "Free shipping on this piece"
                : `Shipping ${formatPrice(shipping.shipping)} at checkout`}
            </li>
            {estimate.codAvailable && (
              <li className="flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-burnt" />
                Cash on delivery available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
