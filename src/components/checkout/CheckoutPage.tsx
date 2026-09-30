"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { CheckIcon } from "@/components/ui/icons";
import { FREE_SHIPPING_THRESHOLD } from "@/data/site";
import { productImage } from "@/lib/images";
import { formatPrice, pluralize } from "@/lib/utils";

/**
 * CheckoutPage — a single-page checkout.
 *
 * Client-validated and self-contained, with a clear "what happens next"
 * confirmation state. No payment is taken: wiring this to a real gateway
 * means replacing `handleSubmit` and keeping everything else.
 */

const SHIPPING_FEE = 99;

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_FORM: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

/** Light client-side validation, mirroring the HTML constraints below. */
function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!values.fullName.trim()) errors.fullName = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (values.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Please enter a 10-digit phone number";
  }
  if (!values.address.trim()) errors.address = "Please enter your address";
  if (!values.city.trim()) errors.city = "Please enter your city";
  if (!values.state.trim()) errors.state = "Please enter your state";
  if (!/^\d{6}$/.test(values.pincode.trim())) errors.pincode = "Enter a 6-digit PIN code";

  return errors;
}

const FIELDS: {
  name: keyof FormValues;
  label: string;
  type: string;
  autoComplete: string;
  full?: boolean;
}[] = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name", full: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", full: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", full: true },
  { name: "address", label: "Address", type: "text", autoComplete: "street-address", full: true },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { name: "state", label: "State", type: "text", autoComplete: "address-level1" },
  { name: "pincode", label: "PIN code", type: "text", autoComplete: "postal-code" },
];


export function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, hydrated } = useStore();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [placed, setPlaced] = useState(false);

  const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = cartSubtotal + shipping;

  const update = (name: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // A real integration would hand off to a payment provider here.
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center gap-7 px-5 py-24 text-center sm:py-32">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ash-400 text-ash-800">
          <CheckIcon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)]">Order confirmed</h1>
          <p className="ap-body mx-auto mt-4 max-w-md text-ink/65">
            Thank you, {values.fullName.split(" ")[0]}. We have sent a confirmation
            to {values.email} and will be in touch when your order ships.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="ap-eyebrow bg-ash-800 px-8 py-4 text-floral-50 transition-colors hover:bg-burnt"
          >
            Continue shopping
          </Link>
          <Link
            href="/faq#tracking"
            className="ap-eyebrow border border-line px-8 py-4 text-ink transition-colors hover:border-ink"
          >
            Track your order
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="py-24 text-center">
        <p className="ap-eyebrow text-ink/40">Loading checkout…</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center gap-7 px-5 py-24 text-center sm:py-32">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)]">Nothing to check out</h1>
          <p className="ap-body mx-auto mt-4 max-w-sm text-ink/65">
            Your bag is empty. Add a piece or two and come back.
          </p>
        </div>
        <Link
          href="/shop"
          className="ap-eyebrow bg-ash-800 px-8 py-4 text-floral-50 transition-colors hover:bg-burnt"
        >
          Browse everything
        </Link>
      </div>
    );
  }


  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <p className="ap-eyebrow mb-3 flex items-center gap-3 text-burnt">
        <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
        Secure checkout
      </p>
      <h1 className="text-[clamp(2rem,4.5vw,3.25rem)]">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16"
      >
        {/* Details */}
        <div>
          <h2 className="text-xl">Delivery details</h2>
          <p className="ap-body mt-2 text-sm text-ink/60">
            We currently deliver across India. Typical delivery is 3–6 working days.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {FIELDS.map((field) => {
              const error = errors[field.name];
              const inputId = `checkout-${field.name}`;

              return (
                <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                  <label htmlFor={inputId} className="ap-eyebrow mb-2 block text-ink/50">
                    {field.label}
                  </label>
                  <input
                    id={inputId}
                    name={field.name}
                    type={field.type}
                    value={values[field.name]}
                    onChange={(event) => update(field.name, event.target.value)}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={
                      error
                        ? "w-full border-b border-burnt bg-transparent py-3 text-sm text-ink outline-none transition-colors"
                        : "w-full border-b border-line bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-burnt"
                    }
                  />
                  {error && (
                    <p
                      id={`${inputId}-error`}
                      role="alert"
                      className="ap-body mt-1.5 text-xs text-burnt"
                    >
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <h2 className="mt-12 text-xl">Payment</h2>
          <div className="mt-5 border border-line bg-ash-50 p-6">
            <p className="ap-body text-sm text-ink/70">
              This is a demonstration storefront, so no payment is taken and no card
              details are collected. In production this section would hand off to a
              secure payment provider.
            </p>
          </div>

          <button
            type="submit"
            className="ap-eyebrow mt-8 w-full bg-ash-800 py-4 text-floral-50 transition-colors duration-500 hover:bg-burnt"
          >
            Place order — {formatPrice(total)}
          </button>

          <p className="ap-body mt-4 text-center text-xs text-ink/50">
            By placing this order you agree to our{" "}
            <Link href="/faq#terms" className="text-burnt underline underline-offset-4">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/faq#privacy" className="text-burnt underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
        </div>


        {/* Order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-ash-50 p-6 sm:p-8">
            <h2 className="text-xl">Your order</h2>
            <p className="ap-eyebrow mt-2 text-ink/45">{pluralize(cart.length, "item")}</p>

            <ul className="mt-6 flex flex-col gap-4 border-b border-line pb-6">
              {cart.map((line) => (
                <li key={`${line.productId}-${line.size}`} className="flex gap-3">
                  <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-floral-400">
                    <Image
                      src={productImage(line.product.photoSet, 0, { width: 160 })}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ash-800 px-1 text-[0.625rem] text-floral-50">
                      {line.quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink">{line.product.name}</span>
                    <span className="ap-eyebrow text-ink/40">Size {line.size}</span>
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-ink">
                    {formatPrice(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="ap-body mt-6 flex flex-col gap-3 text-ink/70">
              <div className="flex justify-between gap-4">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-ink">{formatPrice(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Shipping</dt>
                <dd className="text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
                <dt className="text-ink">Total</dt>
                <dd className="tabular-nums text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </form>
    </div>
  );
}
