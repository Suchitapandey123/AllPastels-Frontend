"use client";

import { useStore } from "@/components/store/StoreProvider";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeartIcon } from "@/components/ui/icons";
import { products } from "@/data/products";
import { pluralize } from "@/lib/utils";

/**
 * WishlistPage — saved items.
 *
 * Resolves the stored product ids against the catalogue, so the page
 * degrades gracefully if an id ever points at something that no longer
 * exists.
 */
export function WishlistPage() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="py-24 text-center">
        <p className="ap-eyebrow text-ink/40">Loading your saved items…</p>
      </div>
    );
  }

  const saved = wishlist
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined);

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-7 px-5 py-24 text-center sm:py-32">
        <HeartIcon className="h-10 w-10 text-burnt" />
        <div>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)]">Nothing saved yet</h1>
          <p className="ap-body mx-auto mt-4 max-w-sm text-ink/65">
            Tap the heart on any piece to keep it here while you think about it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/shop" variant="primary" size="md" withArrow>
            Browse everything
          </Button>
          <Button href="/new-arrivals" variant="outline" size="md" withArrow>
            Shop new arrivals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <h1 className="text-[clamp(2rem,4.5vw,3.25rem)]">Your wishlist</h1>
      <p className="ap-eyebrow mt-3 text-ink/45">{pluralize(saved.length, "saved piece")}</p>

      <div className="mt-10">
        <ProductGrid products={saved} showQuickAdd showRating />
      </div>
    </div>
  );
}
