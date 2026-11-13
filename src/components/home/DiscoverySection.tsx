import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { discoveries } from "@/data/categories";
import { slotUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * DiscoverySection — the "what is this for?" entry point.
 *
 * Distinct from the mood section: mood is about how you feel, discovery is
 * about what the occasion demands. Structured as an asymmetric editorial
 * mosaic on desktop — two tall cards flanking three wide ones — so it
 * reads as a composition rather than a repeating grid.
 */

export function DiscoverySection() {
  const [first, second, ...rest] = discoveries;

  return (
    <Section space="default" tone="canvas">
      <SectionHeading
        eyebrow="Find your way in"
        title="Shop by occasion"
        description="Whether it is a gift, a first day at a new job, or a long weekend somewhere warm."
      />

      <div className="mt-12 grid gap-4 sm:gap-5 lg:auto-rows-[16rem] lg:grid-cols-4 xl:auto-rows-[18rem]">
        <Reveal variant="up" className="h-full lg:col-span-2 lg:row-span-2">
          <DiscoveryCard item={first} large />
        </Reveal>
        <Reveal variant="up" delay={120} className="h-full lg:col-span-2">
          <DiscoveryCard item={second} />
        </Reveal>

        {rest.map((item, index) => (
          <Reveal
            key={item.id}
            variant="up"
            delay={200 + index * 90}
            className="h-full lg:col-span-1"
          >
            <DiscoveryCard item={item} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function DiscoveryCard({
  item,
  large = false,
}: {
  item: (typeof discoveries)[number];
  large?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        // The tile carries its own size: an aspect ratio on phones, and a fill
        // of its fixed-height grid track on desktop. Sizing the `fill` image's
        // own parent is what guarantees a resolved height — no zero-height
        // parent and no grey band behind the photograph.
        "group relative block w-full overflow-hidden rounded-2xl bg-ash-800",
        large ? "aspect-[4/5]" : "aspect-[16/10]",
        "lg:aspect-auto lg:h-full",
      )}
    >
      <Image
        src={slotUrl(item.imageSlot, {
          width: large ? 1200 : 800,
          aspect: large ? "editorial" : "landscape",
        })}
        alt={`${item.title} at AllPastels`}
        fill
        sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 25vw"}
        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ash-100/80 via-ash-100/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <h3
          className={
            large
              ? "text-[clamp(1.75rem,3.5vw,2.75rem)] text-floral"
              : "text-xl text-floral sm:text-2xl"
          }
        >
          {item.title}
        </h3>
        <p
          className={
            large
              ? "ap-body mt-3 max-w-sm text-sm text-floral-700/85"
              : "ap-body mt-2 max-w-xs text-xs text-floral-700/80"
          }
        >
          {item.description}
        </p>

        <ArrowRightIcon className="mt-4 h-5 w-5 -translate-x-2 text-cotton opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
