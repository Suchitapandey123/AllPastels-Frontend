import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { collections } from "@/data/collections";
import { slotUrl } from "@/lib/images";
import { pluralize } from "@/lib/utils";

export const metadata = {
  title: "Collections",
  description:
    "Explore the AllPastels collections — curated edits built around a fabric, a season or an occasion.",
};

/**
 * Collections index.
 *
 * An editorial index rather than a product grid: each collection leads with
 * a photograph and its story, because a collection is a point of view
 * first and a set of products second.
 */
export default function CollectionsPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container>
          <div className="py-12 sm:py-16 lg:py-20">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                Curated edits
              </p>
              <h1 className="text-[clamp(2.25rem,5vw,4rem)]">Collections</h1>
              <p className="ap-body mt-5 max-w-xl text-ink/70">
                Each collection is built around a single idea — a fabric, a
                season, or the kind of day you are dressing for.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
          {collections.map((collection, index) => {
const pieces: never[] = [];

            const lead = pieces[0];

            return (
              <Reveal key={collection.slug} variant="up" delay={(index % 2) * 120}>
                <article className="group">
                  <Link href={collection.href} className="block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ash-800">
                      <Image
                        src={slotUrl(collection.imageSlot, {
                          width: 1100,
                          aspect: "landscape",
                        })}
                        alt={`${collection.title} — ${collection.tagline}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ash-100/80 via-ash-100/20 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] text-floral">
                          {collection.title}
                        </h2>
                        <p className="ap-body mt-2 max-w-sm text-sm text-floral-700/85">
                          {collection.tagline}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <p className="ap-body max-w-md text-ink/65">{collection.description}</p>
                    <span className="ap-eyebrow shrink-0 text-ink/40">
                      {pluralize(collection.productSlugs.length, "piece")}
                    </span>
                  </div>

                  {lead && (
                    <Link
                      href={collection.href}
                      className="ap-eyebrow mt-5 inline-flex items-center gap-2 text-burnt transition-opacity hover:opacity-70"
                    >
                      Shop {collection.title}
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal variant="up" className="mt-20 flex flex-col items-center gap-5 border-t border-line pt-14 text-center">
          <p className="ap-body max-w-md text-ink/60">
            Not sure where to start? The bestsellers are the pieces our customers
            return to most.
          </p>
          <Button href="/shop?sort=rating" variant="outline" size="md" withArrow>
            Shop bestsellers
          </Button>
        </Reveal>
      </Container>
    </>
  );
}
