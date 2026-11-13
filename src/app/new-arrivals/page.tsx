import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/ProductListing";
import { loadProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "The latest additions to AllPastels — fresh pieces made for your everyday, updated every week.",
};

export default async function NewArrivalsPage({
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

  // This page only ever shows new pieces; user filters narrow within them.
  const products = queryProducts(result.products, {
    ...buildFilterState(params),
    sort: "newest",
  }).filter((product) => product.isNew);

  return (
    <ProductListing
      products={products}
      eyebrow="Just landed"
      title="New arrivals"
      description="Fresh pieces, made for your everyday. The newest additions to the AllPastels wardrobe."
      emptyMessage="No new pieces match those filters right now. Try browsing the full collection."
    />
  );
}
