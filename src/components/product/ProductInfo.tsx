"use client";

import { useState } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { Rating } from "@/components/ui/Rating";
import { CheckIcon, TruckIcon, ReturnIcon } from "@/components/ui/icons";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";

/**
 * ProductInfo — the buy box.
 *
 * Holds the two choices a shopper makes (colour and size), the price and
 * the add-to-bag action. Size is required before adding, because most
 * mistakes in fashion e-commerce are size mistakes.
 */

export function ProductInfo({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.compareAtPrice
    ? discountPercent(product.price, product.compareAtPrice)
    : 0;

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    setError(false);
    addToCart(product.id, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex flex-col">
      {/* Category + title */}
      <p className="ap-eyebrow text-ink/45">{product.categoryLabel}</p>
      <h1 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)]">{product.name}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
      </div>

      {/* Price */}
      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-3xl text-ink">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <>
            <span className="text-lg text-ink/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="ap-eyebrow text-burnt">Save {discount}%</span>
          </>
        )}
      </div>
      <p className="ap-body mt-2 text-xs text-ink/50">Inclusive of all taxes</p>

      <p className="ap-body mt-7 max-w-lg text-ink/75">{product.description}</p>

      {/* Colours */}
      {product.colors.length > 0 && (
        <fieldset className="mt-9">
          <legend className="ap-eyebrow mb-3 text-ink/50">
            Colour: <span className="text-ink">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setColor(option.name)}
                aria-pressed={color === option.name}
                aria-label={option.name}
                title={option.name}
                className={cn(
                  "h-8 w-8 rounded-full ring-offset-2 ring-offset-floral-400 transition-all",
                  color === option.name ? "ring-1 ring-ink" : "ring-1 ring-line hover:ring-ink/50",
                )}
                style={{ backgroundColor: option.hex }}
              />
            ))}
          </div>
        </fieldset>
      )}

      {/* Sizes */}
      <fieldset className="mt-8">
        <legend className="ap-eyebrow mb-3 flex w-full items-center justify-between text-ink/50">
          <span>
            Size{size ? <span className="text-ink">: {size}</span> : null}
          </span>
          <span className="normal-case tracking-normal">
            Free returns if the size is wrong
          </span>
        </legend>

        <div className="flex flex-wrap gap-2.5">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSize(option);
                setError(false);
              }}
              aria-pressed={size === option}
              className={cn(
                "min-w-[3.25rem] border px-4 py-2.5 text-sm transition-all",
                size === option
                  ? "border-ink bg-ink text-floral-50"
                  : "border-line text-ink hover:border-ink",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="ap-body mt-3 text-xs text-burnt">
            Please select a size to continue.
          </p>
        )}
      </fieldset>

      {/* Add to bag */}
      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "ap-eyebrow mt-8 flex w-full items-center justify-center gap-2.5 py-4 transition-colors duration-500",
          added
            ? "bg-ash-700 text-floral-50"
            : "bg-ash-800 text-floral-50 hover:bg-burnt",
        )}
      >
        {added ? (
          <>
            <CheckIcon className="h-4 w-4" />
            Added to bag
          </>
        ) : (
          <>Add to bag — {formatPrice(product.price)}</>
        )}
      </button>

      {added && (
        <p role="status" className="ap-body mt-3 text-center text-xs text-ink/55">
          Added. You can find it in your{" "}
          <a href="/cart" className="text-burnt underline underline-offset-4">
            bag
          </a>
          .
        </p>
      )}

      {/* Service promises */}
      <ul className="mt-9 flex flex-col gap-3 border-t border-line pt-7">
        <li className="flex items-center gap-3 text-sm text-ink/70">
          <TruckIcon className="h-5 w-5 shrink-0 text-burnt" />
          Complimentary shipping on orders over ₹2,999
        </li>
        <li className="flex items-center gap-3 text-sm text-ink/70">
          <ReturnIcon className="h-5 w-5 shrink-0 text-burnt" />
          Free 15-day returns, no questions asked
        </li>
      </ul>
    </div>
  );
}
