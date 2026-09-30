import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collections } from "@/data/collections";
import { SITE } from "@/data/site";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { productImage } from "@/lib/images";
import { products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every product page at build time. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `${SITE.url}/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE.name}`,
      description: product.summary,
      url: `${SITE.url}/products/${product.slug}`,
      images: [{ url: productImage(product.photoSet, 0, { width: 1200 }), width: 1200, height: 1600 }],
    },
  };
}

/**
 * Product structured data (schema.org/Product).
 *
 * Emitted so search engines can surface price, availability and rating as
 * rich results, and to keep the listing consistent with the visible page.
 */
function ProductJsonLd({
  name,
  description,
  slug,
  image,
  price,
  rating,
  reviewCount,
  availability,
}: {
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  availability: "InStock" | "OutOfStock";
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: SITE.name },
    sku: slug,
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${slug}`,
      priceCurrency: "INR",
      price,
      availability: `https://schema.org/${availability}`,
      seller: { "@type": "Organization", name: SITE.name },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a known-shape object, so no user input is involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  // Full collection records this piece belongs to, for the "part of" links.
  const productCollections = product.collections
    .map((slug) => collections.find((collection) => collection.slug === slug))
    .filter((collection) => collection !== undefined);

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        slug={product.slug}
        image={productImage(product.photoSet, 0, { width: 1200 })}
        price={product.price}
        rating={product.rating}
        reviewCount={product.reviewCount}
        availability="InStock"
      />

      {/* Breadcrumb */}
      <div className="border-b border-line bg-ash-50">
        <Container>
          <nav aria-label="Breadcrumb" className="py-4">
            <ol className="ap-eyebrow flex flex-wrap items-center gap-2 text-ink/45">
              <li>
                <Link href="/" className="transition-colors hover:text-burnt">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/${product.category}`}
                  className="transition-colors hover:text-burnt"
                >
                  {product.category}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Gallery + buy box */}
      <Container>
        <div className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <ProductGallery photoSet={product.photoSet} productName={product.name} />
          <div className="lg:pt-4">
            <ProductInfo product={product} />
          </div>
        </div>
      </Container>

      {/* Details */}
      <section className="border-t border-line bg-ash-50">
        <Container>
          <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
            <div className="lg:col-span-5">
              <Reveal variant="up">
                <h2 className="text-2xl">Details & care</h2>
                <ul className="ap-body mt-6 flex flex-col gap-3 text-ink/70">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-burnt" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal variant="up" delay={120}>
                <h2 className="text-2xl">Good to know</h2>
                <dl className="ap-body mt-6 flex flex-col gap-4 text-ink/70">
                  <div className="flex justify-between gap-6 border-b border-line pb-4">
                    <dt className="text-ink/50">Category</dt>
                    <dd>{product.categoryLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-6 border-b border-line pb-4">
                    <dt className="text-ink/50">Colours</dt>
                    <dd>{product.colors.map((c) => c.name).join(", ")}</dd>
                  </div>
                  <div className="flex justify-between gap-6 border-b border-line pb-4">
                    <dt className="text-ink/50">Sizes</dt>
                    <dd>{product.sizes.join(", ")}</dd>
                  </div>
                  {productCollections.length > 0 && (
                    <div className="flex justify-between gap-6">
                      <dt className="shrink-0 text-ink/50">Part of</dt>
                      <dd className="text-right">
                        {productCollections.map((collection) => (
                          <Link
                            key={collection.slug}
                            href={collection.href}
                            className="block text-burnt underline underline-offset-4 transition-opacity hover:opacity-70"
                          >
                            {collection.title}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <Container className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="You may also like"
            title="Pairs well with"
            description="Pieces chosen because they share this piece's fabric, colour or occasion."
          />
          <div className="mt-10">
            <ProductGrid products={related} showQuickAdd showRating />
          </div>
        </Container>
      )}
    </>
  );
}

