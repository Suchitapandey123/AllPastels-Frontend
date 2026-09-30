import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/ProductListing";
import { getAllProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";
import { FREE_SHIPPING_THRESHOLD } from "@/data/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sale",
  description:
    "Reduced AllPatels pieces — the same fabrics and construction, at a lower price, while sizes last.",
};

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const products = queryProducts(getAllProducts(), {
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
