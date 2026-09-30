import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/ProductListing";
import { getAllProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "The latest additions to AllPatels — fresh pieces made for your everyday, updated every week.",
};

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // This page only ever shows new pieces; user filters narrow within them.
  const products = queryProducts(getAllProducts(), {
    ...buildFilterState(params),
    sort: "newest",
  }).filter((product) => product.isNew);

  return (
    <ProductListing
      products={products}
      eyebrow="Just landed"
      title="New arrivals"
      description="Fresh pieces, made for your everyday. The newest additions to the AllPatels wardrobe."
      emptyMessage="No new pieces match those filters right now. Try browsing the full collection."
    />
  );
}
