import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { loadProducts, getNewArrivals } from "@/lib/catalog";

/**
 * NewArrivals — the freshest eight pieces, in a 4/3/2 grid.
 *
 * Quick-add is enabled here because this is the section where shoppers are
 * still browsing rather than comparing — one tap should be enough.
 */

export async function NewArrivals() {
  const result = await loadProducts();
  const products = result.ok ? getNewArrivals(result.products).slice(0, 8) : [];

  return (
    <Section space="default" tone="canvas">
      <Reveal variant="up">
        <SectionHeading
          eyebrow="Just landed"
          title="New arrivals"
          description="Fresh pieces, made for your everyday."
          action={
            <Button href="/new-arrivals" variant="outline" size="sm" withArrow>
              View all new in
            </Button>
          }
        />
      </Reveal>

      <div className="mt-12">
        <ProductGrid products={products} showQuickAdd showRating={false} />
      </div>
    </Section>
  );
}
