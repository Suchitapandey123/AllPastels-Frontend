import { Suspense } from "react";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSort } from "@/components/product/ProductSort";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { pluralize } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * ProductListing — the shared shell behind every listing page.
 *
 * `/shop`, `/women`, `/men`, `/kids`, `/new-arrivals`, `/sale`, `/search`
 * and every collection all render through this one component. Each route
 * page only decides *which* products it has and what heading to use, so
 * filtering, sorting, empty states and the mobile layout can never drift
 * apart between pages.
 *
 * Results arrive already filtered and sorted from the server component, so
 * the first paint is complete and indexable.
 */

interface ProductListingProps {
  products: Product[];
  eyebrow: string;
  title: string;
  description: string;
  /** Hides the filter sidebar — used on /search where facets make less sense. */
  showFilters?: boolean;
  /** Message shown when the result set is empty. */
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function ProductListing({
  products,
  eyebrow,
  title,
  description,
  showFilters = true,
  emptyMessage,
  children,
}: ProductListingProps) {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-line bg-ash-50">
        <Container>
          <div className="py-12 sm:py-16 lg:py-20">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                {eyebrow}
              </p>
              <h1 className="text-[clamp(2.25rem,5vw,4rem)]">{title}</h1>
              <p className="ap-body mt-5 max-w-xl text-ink/70">{description}</p>
              {children}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Results */}
      <Container className="py-12 sm:py-16">
        <div className={showFilters ? "lg:grid lg:grid-cols-[240px_1fr] lg:gap-12" : ""}>
          {showFilters && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {/* Filters and sort read the URL, so they must be inside a
                  Suspense boundary during static generation. */}
              <Suspense fallback={<div className="h-64" />}>
                <ProductFilters resultCount={products.length} />
              </Suspense>
            </aside>
          )}

          <div className={showFilters ? "mt-10 lg:mt-0" : ""}>
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="ap-eyebrow text-ink/50" role="status">
                {pluralize(products.length, "piece")}
              </p>
              <Suspense fallback={<div className="h-8" />}>
                <ProductSort />
              </Suspense>
            </div>

            <ProductGrid products={products} showQuickAdd emptyMessage={emptyMessage} />

            {products.length > 0 && (
              <div className="mt-16 flex flex-col items-center gap-5 border-t border-line pt-10 text-center">
                <p className="ap-body text-ink/50">
                  You have seen all {pluralize(products.length, "piece")} in this edit.
                </p>
                <Button href="/shop" variant="outline" size="sm" withArrow>
                  Browse everything
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
