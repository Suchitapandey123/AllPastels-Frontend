"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * QuickAdd — adds a product to the cart from a listing card.
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

export function QuickAdd({ productId, productName, sizes, className }: QuickAddProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  // Reset the confirmation so the button is ready for a second tap.
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(productId, sizes[0]);
    setAdded(true);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={
        added ? `${productName} added to bag` : `Add ${productName} to bag`
      }
      className={cn(
        "ap-eyebrow flex items-center justify-center gap-2 transition-all duration-500",
        "px-4 py-2.5",
        added
          ? "bg-ash-700 text-floral-50"
          : "bg-ash-800 text-floral-50 hover:bg-burnt",
        className,
      )}
    >
      {added ? (
        <>
          <CheckIcon className="h-3.5 w-3.5" />
          Added
        </>
      ) : (
        "Quick add"
      )}
    </button>
  );
}
