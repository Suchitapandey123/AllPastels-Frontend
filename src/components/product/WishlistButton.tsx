"use client";

import { useStore } from "@/components/store/StoreProvider";
import { HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * WishlistButton — toggles a product in the saved list.
 *
 * Server-rendered pages pass the product id; state lives in the store so
 * the button stays in sync between the card, the product page and the
 * wishlist itself.
 */

interface WishlistButtonProps {
  productId: string;
  className?: string;
  /** Shows the product name in the accessible label. */
  productName?: string;
  size?: "sm" | "md";
}

export function WishlistButton({
  productId,
  className,
  productName,
  size = "md",
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useStore();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      onClick={(event) => {
        // Cards are wrapped in a link; don't navigate when saving.
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${productName ?? "item"} from wishlist`
          : `Save ${productName ?? "item"} to wishlist`
      }
      className={cn(
        "group/wish flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-500",
        "bg-floral/85 hover:bg-floral active:scale-95",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className,
      )}
    >
      <HeartIcon
        className={cn(
          "transition-colors duration-300",
          size === "sm" ? "h-4 w-4" : "h-[1.15rem] w-[1.15rem]",
          active ? "text-burnt" : "text-ink/70 group-hover/wish:text-burnt",
        )}
        filled={active}
      />
    </button>
  );
}
