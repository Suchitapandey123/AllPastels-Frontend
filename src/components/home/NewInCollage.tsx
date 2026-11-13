import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { collections } from "@/data/collections";
import { slotUrl } from "@/lib/images";

/**
 * NewInCollage — the merchandising band.
 *
 * A clean, product-focused row of labelled collection tiles — the "New in:
 * the winter closet" idea, restructured for AllPastels. Where the category
 * cards offer four large doors in, these tiles are closer to shop windows:
 * smaller, labelled, and orientated around curated edits rather than
 * departments.
 *
 * Distinct from the occasion mosaic further down the page, which is
 * deliberately asymmetric; this band is an even, calm grid so the two never
 * read as the same treatment twice.
 */

/** The collections surfaced here, in the order they should appear. */
const FEATURED_SLUGS = ["the-new-edit", "warm-weather", "soft-structure", "after-dark"];

export function NewInCollage() {
  const tiles = FEATURED_SLUGS.flatMap((slug) =>
    collections.filter((collection) => collection.slug === slug),
  );

  return (
    <Section space="default" tone="canvas">
      <Reveal variant="up">
        <SectionHeading
          eyebrow="Just landed"
          title="New in: the collections"
          description="Curated edits for the season — each one a small, considered world of its own."
          action={
            <Button href="/collections" variant="outline" size="sm" withArrow>
              View all collections
            </Button>
          }
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {tiles.map((collection, index) => (
          <Reveal key={collection.slug} variant="up" delay={index * 90}>
            <Link
              href={collection.href}
              className="group relative block overflow-hidden rounded-2xl bg-ash-800 focus-visible:outline-offset-4"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={slotUrl(collection.imageSlot, { width: 800, aspect: "portrait" })}
                  alt={`${collection.title} — shop the collection`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ash-100/85 via-ash-100/20 to-transparent" />

                {index === 0 && (
                  <span className="ap-eyebrow absolute left-4 top-4 bg-cotton px-2.5 py-1 text-ink">
                    New
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-xl text-floral sm:text-2xl">{collection.title}</h3>

                  <p className="ap-body mt-2 max-h-0 overflow-hidden text-xs text-floral-700/85 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-20 group-hover:opacity-100">
                    {collection.tagline}
                  </p>

                  <span className="ap-eyebrow mt-3 inline-flex items-center gap-2 text-cotton">
                    Shop
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
