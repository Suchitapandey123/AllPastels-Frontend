import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { getBestsellers } from "@/lib/catalog";

/**
 * Bestsellers — the most-loved pieces, on the lightest surface colour.
 *
 * Setting this band on Ash-50 rather than the Floral White canvas is what
 * breaks up the page: alternating the background tone between sections is
 * the cheapest way to make a long page feel art-directed.
 */

export function Bestsellers() {
  const products = getBestsellers().slice(0, 8);

  return (
    <Section space="default" tone="surface">
      <Reveal variant="up">
        <SectionHeading
          eyebrow="Most loved"
          title="Bestsellers"
          description="The pieces our customers keep coming back for, and re-ordering in a second colour."
          action={
            <Button href="/shop?sort=rating" variant="outline" size="sm" withArrow>
              Shop bestsellers
            </Button>
          }
        />
      </Reveal>

      <div className="mt-12">
        <ProductGrid products={products} showQuickAdd showRating />
      </div>
    </Section>
  );
}
