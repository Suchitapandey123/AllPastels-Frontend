import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";
import { getAllProducts, queryProducts } from "@/lib/catalog";
import { buildFilterState } from "@/lib/search-params";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the AllPatels collection by name, category, colour or occasion.",
  // Search result pages have no standalone value in an index.
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const term = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";

  const products = term
    ? queryProducts(getAllProducts(), buildFilterState(params))
    : [];

  // No search submitted yet — prompt rather than showing an empty grid.
  if (!term) {
    return (
      <Container className="py-20 text-center sm:py-28">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)]">What are you looking for?</h1>
        <p className="ap-body mx-auto mt-5 max-w-md text-ink/70">
          Search by name, category, colour or the occasion you have in mind — try
          &ldquo;linen&rdquo;, &ldquo;knit&rdquo; or &ldquo;gift&rdquo;.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/shop" variant="primary" size="md" withArrow>
            Browse everything
          </Button>
          <Button href="/collections" variant="outline" size="md" withArrow>
            Explore collections
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-line bg-ash-50">
        <Container>
          <div className="py-12 sm:py-16">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                Search results
              </p>
              <h1 className="text-[clamp(2rem,4.5vw,3.5rem)]">
                {pluralize(products.length, "result")} for &ldquo;{term}&rdquo;
              </h1>
              {products.length > 0 && (
                <p className="ap-body mt-4 max-w-xl text-ink/70">
                  Showing pieces that match your search, sorted by{" "}
                  {params.sort ? "your chosen order" : "relevance"}.
                </p>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        {products.length > 0 ? (
          <ProductGrid products={products} showQuickAdd showRating />
        ) : (
          <div className="flex flex-col items-center gap-6 border border-dashed border-line bg-ash-50 px-6 py-20 text-center">
            <p className="max-w-sm text-lg text-ink/70">
              We could not find anything matching &ldquo;{term}&rdquo;. Try a
              broader word, or browse by category instead.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/shop" variant="primary" size="sm" withArrow>
                Shop all pieces
              </Button>
              <Button href="/women" variant="outline" size="sm" withArrow>
                Browse women
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
