import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { collections } from "@/data/collections";
import { loadProducts, getProductBySlug } from "@/lib/catalog";
import { slotUrl } from "@/lib/images";
import { pluralize } from "@/lib/utils";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((entry) => entry.slug === slug);

  if (!collection) return { title: "Collection not found" };

  return {
    title: collection.title,
    description: `${collection.tagline} — ${collection.description}`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = collections.find((entry) => entry.slug === slug);

  if (!collection) notFound();

  const result = await loadProducts();
  const products = result.ok
    ? collection.productSlugs
        .map((productSlug) => getProductBySlug(result.products, productSlug))
        .filter((product): product is NonNullable<typeof product> => product !== undefined)
    : [];

  return (
    <>
      {/* Editorial header */}
      <section className="bg-ash">
        <Container className="py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="ap-eyebrow mb-4 flex items-center gap-3 text-ink/70">
                <span aria-hidden="true" className="h-px w-8 bg-ash-100/40" />
                Collection
              </p>
              <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink">
                {collection.title}
              </h1>
              <p className="ap-body mt-5 max-w-lg text-lg text-ink/75">
                {collection.tagline}
              </p>
              <p className="ap-body mt-4 max-w-lg text-ink/70">{collection.description}</p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="#pieces" variant="primary" size="md" withArrow>
                  Shop the edit
                </Button>
                <span className="ap-eyebrow text-ink/55">
                  {pluralize(products.length, "piece")}
                </span>
              </div>
            </div>

            <ParallaxImage
              src={slotUrl(collection.imageSlot, { width: 1200, aspect: "portrait" })}
              alt={`${collection.title} — AllPastels collection`}
              aspect="portrait"
              strength={26}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>

      {/* Pieces */}
      <Section space="default" tone="canvas" className="scroll-mt-24" id="pieces">
        <h2 className="sr-only">Pieces in {collection.title}</h2>
        <ProductGrid products={products} showQuickAdd showRating />
      </Section>

      {/* Continue shopping */}
      <Section space="tight" tone="surface">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="ap-body text-ink/60">
            There is more in the full collection beyond this edit.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/collections" variant="outline" size="sm" withArrow>
              All collections
            </Button>
            <Button href="/shop" variant="ghost" size="sm" withArrow>
              Shop everything
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
