import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { collections } from "@/data/collections";
import { slotUrl } from "@/lib/images";

/**
 * FeaturedCollection — the editorial split.
 *
 * One side carries a drifting photograph, the other the words. Set on Ash
 * Grey so the Floral White sections either side of it frame it. The image
 * column reverses on mobile so the copy still leads on a phone.
 */

export function FeaturedCollection() {
  const collection = collections[0];

  return (
    <Section space="loose" tone="ash">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <Reveal variant="clip" duration={1200} className="order-1 lg:order-2">
          <ParallaxImage
            src={slotUrl(collection.imageSlot, { width: 1200, aspect: "editorial" })}
            alt={`${collection.title} — the AllPastels seasonal collection`}
            aspect="editorial"
            strength={28}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="shadow-sm"
          />
        </Reveal>

        {/* Copy */}
        <div className="order-2 flex flex-col items-start lg:order-1">
          <Reveal variant="left" distance={32}>
            <p className="ap-eyebrow mb-5 flex items-center gap-3 text-ink/70">
              <span aria-hidden="true" className="h-px w-8 bg-ash-100/40" />
              Featured collection
            </p>
          </Reveal>

          <Reveal variant="left" distance={32} delay={110}>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-ink">
              The new edit
            </h2>
          </Reveal>

          <Reveal variant="left" distance={32} delay={220}>
            <p className="ap-body mt-6 max-w-md text-lg text-ink/75">
              Soft silhouettes. Warm tones. Effortless details.
            </p>
          </Reveal>

          <Reveal variant="left" distance={32} delay={320}>
            <p className="ap-body mt-5 max-w-md text-ink/70">
              {collection.description}
            </p>
          </Reveal>

          <Reveal variant="up" delay={420} className="mt-9">
            <Button href={collection.href} variant="primary" size="lg" withArrow>
              Explore collection
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
