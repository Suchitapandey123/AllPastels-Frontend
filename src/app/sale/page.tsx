import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/ProductListing";
import { loadProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";
import { FREE_SHIPPING_THRESHOLD } from "@/data/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sale",
  description:
    "Reduced AllPastels pieces — the same fabrics and construction, at a lower price, while sizes last.",
};

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const result = await loadProducts();
  if (!result.ok) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-lg text-ink/70">{result.error}</p>
        <a href="" className="mt-6 inline-block text-burnt underline">Try again</a>
      </div>
    );
  }

  const products = queryProducts(result.products, {
    ...buildFilterState(params),
    sort: "price-asc",
  }).filter((product) => typeof product.compareAtPrice === "number");

  return (
    <ProductListing
      products={products}
      eyebrow="Reduced"
      title="Sale"
      description={`The same fabrics and construction as everything else we make, at a lower price. Free shipping still applies over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}
      emptyMessage="Nothing reduced matches those filters at the moment. The sale changes often — do check back."
    />
  );
}
