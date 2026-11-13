import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { moods } from "@/data/categories";
import { slotUrl, type ImageSlot } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * MoodSection — "What are you looking for?".
 *
 * The premise: people rarely shop by "category", they shop by "what am I
 * doing". Rendered as a playful ring of circular avatars on soft pastel
 * discs — the category-discovery gesture of modern commerce homepages,
 * softened into the AllPastels palette (Cotton Rose, Powder Blush, Ash Grey).
 *
 * Six entry points (the five moods plus Gifting) sit on a six-across grid on
 * desktop and a three-across grid on phones, so the whole idea is visible at
 * a glance without a horizontal scroll.
 */

interface CircleItem {
  id: string;
  title: string;
  href: string;
  imageSlot: ImageSlot;
}

const CIRCLES: CircleItem[] = [
  ...moods.map(({ id, title, href, imageSlot }) => ({ id, title, href, imageSlot })),
  {
    id: "gifting",
    title: "Gifting",
    href: "/collections?collection=gifting-edit",
    imageSlot: "discoveryGifting",
  },
];

/** Pastel discs, cycled so adjacent circles never repeat a tone. */
const RING_COLORS = [
  "bg-cotton-700",
  "bg-powder-800",
  "bg-ash-800",
  "bg-floral-400",
  "bg-cotton-800",
  "bg-powder-700",
];

export function MoodSection() {
  return (
    <Section space="default" tone="surface">
      <Reveal variant="up">
        <SectionHeading
          align="center"
          eyebrow="Find your way in"
          title="What are you looking for?"
          description="Start with the moment — we will point you to the pieces that fit it."
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-6 lg:gap-x-10">
        {CIRCLES.map((item, index) => (
          <Reveal key={item.id} variant="up" delay={index * 70}>
            <Link
              href={item.href}
              className="group flex flex-col items-center gap-4 text-center"
            >
              <span
                className={cn(
                  "relative block w-full max-w-[9.5rem] rounded-full p-1.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]",
                  RING_COLORS[index % RING_COLORS.length],
                )}
              >
                <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-ash-800">
                  <Image
                    src={slotUrl(item.imageSlot, { width: 500, aspect: "square" })}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 30vw, 16vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                </span>
              </span>

              <span className="ap-eyebrow text-ink transition-colors duration-300 group-hover:text-burnt">
                {item.title}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
