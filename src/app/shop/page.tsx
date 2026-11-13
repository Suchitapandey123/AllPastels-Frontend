import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/ProductListing";
import { loadProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse the complete AllPastels collection — women, men, kids and accessories, filterable by category, mood, collection and price.",
};

export default async function ShopPage({
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
  const products = result.products;
  const filtered = queryProducts(products, buildFilterState(params));

  return (
    <ProductListing
      products={filtered}
      eyebrow="Everything"
      title="Shop all pieces"
      description="The full AllPastels range. Filter by category, the occasion you have in mind, or the price you want to spend."
      emptyMessage="Nothing matches that combination of filters. Try clearing one to see more."
    />
  );
}
