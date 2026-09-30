import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/ProductListing";
import { getAllProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse the complete AllPatels collection — women, men, kids and accessories, filterable by category, mood, collection and price.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const products = queryProducts(getAllProducts(), buildFilterState(params));

  return (
    <ProductListing
      products={products}
      eyebrow="Everything"
      title="Shop all pieces"
      description="The full AllPatels range. Filter by category, the occasion you have in mind, or the price you want to spend."
      emptyMessage="Nothing matches that combination of filters. Try clearing one to see more."
    />
  );
}
