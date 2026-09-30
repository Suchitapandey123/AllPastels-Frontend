import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { categories } from "@/data/categories";
import { slotUrl } from "@/lib/images";

/**
 * ShopByCategory — four large entry points into the catalogue.
 *
 * Desktop shows a 2×2 grid so the imagery stays generous; below `lg` the
 * cards collapse into a swipeable rail, which keeps the section from
 * becoming a long scroll on a phone.
 */

export function CategorySection() {
  return (
    <Section space="default" tone="canvas">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        description="Four ways in — whichever door suits the day you are having."
      />

      {/* Desktop: 2×2 editorial grid */}
      <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-2 lg:gap-8">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>

      {/* Mobile / tablet: swipeable rail */}
      <div className="ap-scroll-x -mx-5 mt-10 flex snap-x snap-mandatory gap-4 px-5 sm:-mx-8 sm:px-8 lg:hidden">
        {categories.map((category, index) => (
          <div key={category.id} className="w-[78vw] shrink-0 sm:w-[46vw]">
            <CategoryCard category={category} index={index} />
          </div>
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
    <Reveal variant="up" delay={index * 110} className="h-full">
      <Link
        href={category.href}
        className="group relative block h-full overflow-hidden bg-ash-100 focus-visible:outline-offset-4"
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5]">
          <Image
            src={slotUrl(category.imageSlot, { width: 1000, aspect: "editorial" })}
            alt={`Shop ${category.title} at AllPatels`}
            fill
            sizes="(max-width: 1024px) 46vw, 50vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />

          {/* Overlay deepens on hover so the label always stays legible. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ash-800/75 via-ash-800/15 to-transparent transition-opacity duration-700 group-hover:from-ash-800/85" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="ap-eyebrow mb-2 text-cotton-400">{category.productCount} pieces</p>

            <h3 className="flex items-center gap-3 text-[clamp(1.75rem,3vw,2.5rem)] text-floral-400">
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
                {category.title}
              </span>
              <ArrowRightIcon className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
            </h3>

            {/* Description and count slide in on hover (desktop only). */}
            <p className="ap-body mt-0 max-w-sm translate-y-3 text-sm text-floral-200/85 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 lg:block">
              {category.description}
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
