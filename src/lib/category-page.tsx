import { ProductListing } from "@/components/shop/ProductListing";
import { loadProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";
import type { CategoryId } from "@/lib/types";

/**
 * Shared implementation for /women, /men, /kids and the accessories view.
 *
 * Each of those pages differs only by its category, so they all call this
 * factory. The category is forced in the filter state, which means a
 * visitor cannot widen a category page into the whole catalogue by editing
 * the URL — but they can still filter by mood, collection and price.
 */
export function createCategoryPage(category: CategoryId) {
  return async function CategoryPage({
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

    const products = queryProducts(
      result.products,
      // `categories` is overridden rather than merged, so the page always
      // shows its own category and only its own.
      buildFilterState(params, { categories: [category] }),
    );

    return (
      <ProductListing
        products={products}
        eyebrow={category}
        title={CATEGORY_COPY[category].title}
        description={CATEGORY_COPY[category].description}
        emptyMessage={`No ${CATEGORY_COPY[category].title.toLowerCase()} pieces match those filters. Try widening your selection.`}
      />
    );
  };
}

const CATEGORY_COPY: Record<
  CategoryId,
  { title: string; description: string }
> = {
  women: {
    title: "Women",
    description:
      "Fluid dresses, soft tailoring and layers cut from natural fabrics — designed to be worn from a Monday morning to a late evening.",
  },
  men: {
    title: "Men",
    description:
      "Considered essentials in cotton, linen and merino. Shirts that press well without ironing, and knitwear that keeps its shape.",
  },
  kids: {
    title: "Kids",
    description:
      "The same natural fabrics and considered fits as the rest of the range, made in small sizes for very active people.",
  },
  accessories: {
    title: "Accessories",
    description:
      "The finishing details — bags, silk, jewellery and footwear chosen to sit alongside everything else we make.",
  },
};
