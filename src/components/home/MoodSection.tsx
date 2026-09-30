import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { moods } from "@/data/categories";
import { slotUrl } from "@/lib/images";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * ShopByMood — occasion-based discovery.
 *
 * The premise: people rarely shop by "category", they shop by "what am I
 * doing". Five moods, each a window into a filtered product list.
 *
 * Renders as a five-across editorial row on desktop and a snap-scrolling
 * carousel on phones, where five tall cards would otherwise dominate the
 * whole viewport.
 */

export function MoodSection() {
  return (
    <Section space="default" tone="canvas">
      <SectionHeading
        eyebrow="By occasion"
        title="Shop by mood"
        description="Start with the day you are having, not the garment you think you need."
      />

      <div className="ap-scroll-x -mx-5 mt-12 flex snap-x snap-mandatory gap-4 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:px-0">
        {moods.map((mood, index) => (
          <Reveal
            key={mood.id}
            variant="up"
            delay={index * 90}
            className="w-[64vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto"
          >
            <Link href={mood.href} className="group relative block overflow-hidden bg-ash-100">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={slotUrl(mood.imageSlot, { width: 700, aspect: "portrait" })}
                  alt={`${mood.title} — shop the AllPatels edit`}
                  fill
                  sizes="(max-width: 640px) 64vw, (max-width: 1024px) 38vw, 20vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ash-800/80 via-ash-800/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="text-2xl text-floral-400 sm:text-[1.75rem]">{mood.title}</h3>

                  <p className="ap-body mt-2 max-w-[24ch] text-xs text-floral-200/80 lg:mt-0 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:mt-2 lg:group-hover:max-h-24 lg:group-hover:opacity-100">
                    {mood.description}
                  </p>

                  <span className="ap-eyebrow mt-4 inline-flex items-center gap-2 text-cotton-400">
                    Shop
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
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
