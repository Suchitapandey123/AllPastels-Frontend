import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { categories } from "@/data/categories";
import { slotUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * ShopByCategory — four large entry points into the catalogue.
 *
 * A clean, pastel-forward grid rather than full-bleed overlay cards: the
 * photograph sits on top and the label lives in a soft pastel panel beneath
 * it. Rounded corners, a hairline ring and a gentle lift on hover keep the
 * presentation premium (DailyObjects); the pastel panels keep it warm and
 * playful (Fancy Pastels).
 *
 * Two cards per row at every breakpoint, so each category keeps enough
 * presence to read as a doorway rather than a thumbnail.
 */

/** Soft pastel footers, cycled per card. */
const PANEL_TONES = ["bg-cotton-800", "bg-powder-800", "bg-ash-800", "bg-floral-400/50"];

export function CategorySection() {
  return (
    <Section space="default" tone="surface">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        description="Four ways in — whichever door suits the day you are having."
        action={
          <Button href="/shop" variant="outline" size="sm" withArrow>
            View all
          </Button>
        }
      />

      {/* A clean, pastel-forward grid — two large cards per row on every
          breakpoint, so each category reads as a doorway rather than a tile. */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </Section>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: (typeof categories)[number];
  index: number;
}) {
  return (
    <Reveal variant="up" delay={index * 100} className="h-full">
      <Link
        href={category.href}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-floral shadow-sm ring-1 ring-line transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-xl focus-visible:outline-offset-4"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ash-800 sm:aspect-[16/11]">
          <Image
            src={slotUrl(category.imageSlot, { width: 1000, aspect: "editorial" })}
            alt={`Shop ${category.title} at AllPastels`}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />

          {/* Piece count as a translucent pill so the photograph stays unobstructed. */}
          <span className="ap-eyebrow absolute left-4 top-4 rounded-full bg-floral/90 px-3 py-1.5 text-ink/70 backdrop-blur-sm">
            {category.productCount} pieces
          </span>
        </div>

        {/* Pastel footer — the label sits below the image, DailyObjects-style. */}
        <div
          className={cn(
            "flex flex-1 items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5",
            PANEL_TONES[index % PANEL_TONES.length],
          )}
        >
          <div className="min-w-0">
            <h3 className="text-lg text-ink sm:text-2xl">{category.title}</h3>
            <p className="ap-body mt-1 line-clamp-2 text-xs text-ink/60 sm:text-sm">
              {category.description}
            </p>
          </div>

          <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-floral text-ink shadow-sm transition-colors duration-500 group-hover:bg-ink group-hover:text-floral sm:grid">
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
