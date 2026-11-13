"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * QuickAdd — adds a product to the server cart from a listing card.
 *
 * One-tap add using the first available size, with a brief inline
 * confirmation. The full size selection lives on the product page; this is
 * the "I already know what I want" shortcut.
 */

interface QuickAddProps {
  productId: string;
  productName: string;
  sizes: string[];
  className?: string;
}

type QuickAddState = "idle" | "adding" | "added" | "error";

export function QuickAdd({ productId, productName, sizes, className }: QuickAddProps) {
  const { addToCart } = useStore();
  const [status, setStatus] = useState<QuickAddState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Reset the confirmation/error so the button is ready for another attempt.
  useEffect(() => {
    if (status !== "added" && status !== "error") return;
    const timer = window.setTimeout(() => {
      setStatus("idle");
      setError(null);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [status]);

  const handleAdd = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (status === "adding") return;

    setStatus("adding");
    setError(null);
    const result = await addToCart(productId, sizes[0] ?? "", 1);

    if (result.ok) {
      setStatus("added");
      return;
    }

    setStatus("error");
    setError(result.error);
  };

  const label =
    status === "adding"
      ? "Adding…"
      : status === "added"
        ? "Added"
        : status === "error"
          ? "Couldn't add"
          : "Quick add";

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={status === "adding"}
      aria-live="polite"
      aria-busy={status === "adding"}
      title={error ?? undefined}
      aria-label={
        status === "added"
          ? `${productName} added to bag`
          : status === "error"
            ? `${error ?? `Could not add ${productName} to bag`}`
            : `Add ${productName} to bag`
      }
      className={cn(
        "ap-eyebrow flex items-center justify-center gap-2 transition-all duration-500",
        "px-4 py-2.5",
        status === "added"
          ? "bg-ash-200 text-floral-900"
          : status === "error"
            ? "bg-burnt-900 text-burnt-200"
            : "bg-ash-100 text-floral-900 hover:bg-burnt",
        "disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {status === "added" ? (
        <>
          <CheckIcon className="h-3.5 w-3.5" />
          Added
        </>
      ) : (
        label
      )}
    </button>
  );
}
