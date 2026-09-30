import { Reveal } from "@/components/animations/Reveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { slotUrl } from "@/lib/images";

/**
 * CampaignSection — a single, confident promotional moment.
 *
 * Set on Burnt Peach, the site's strongest colour. The photograph is small
 * and off to one side so the type carries the section; the whole band
 * reads as one poster rather than a layout.
 */

export function CampaignSection() {
  return (
    <section className="relative overflow-hidden bg-burnt-400 py-20 sm:py-28 lg:py-36">
      {/* Soft tonal shapes for depth — no gradients over the photography. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cotton-400/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-powder-400/25 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-6 flex items-center gap-3 text-ash-800/70">
                <span aria-hidden="true" className="h-px w-8 bg-ash-800/40" />
                The campaign
              </p>
            </Reveal>

            <Reveal variant="up" delay={120}>
              <h2 className="text-[clamp(2.75rem,8vw,6rem)] font-normal leading-[0.92] tracking-[-0.03em] text-ash-800">
                Your style,
                <br />
                <span className="italic text-floral-400">your story.</span>
              </h2>
            </Reveal>

            <Reveal variant="up" delay={240}>
              <p className="ap-body mt-7 max-w-lg text-lg text-ash-800/80">
                This season is about the pieces that sound like you — worn your way,
                mixed your way, until they are unmistakably yours.
              </p>
            </Reveal>

            <Reveal variant="up" delay={340} className="mt-10">
              <Button href="/collections" variant="light" size="lg" withArrow>
                Shop the edit
              </Button>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={260} className="lg:col-span-5">
            <ParallaxImage
              src={slotUrl("campaign", { width: 900, aspect: "editorial" })}
              alt="AllPatels seasonal campaign"
              aspect="editorial"
              strength={22}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="shadow-xl"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
