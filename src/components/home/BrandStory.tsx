import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { slotUrl } from "@/lib/images";

/**
 * BrandStory — the full-width philosophy statement on Ash Grey.
 *
 * Oversized type that spans nearly the full width, a drifting image band
 * beneath it, and a short body of copy. This is the emotional peak of the
 * page, so the type is allowed to be genuinely large.
 */

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-ash-400 py-20 sm:py-28 lg:py-40">
      <Container>
        <Reveal variant="up" duration={1100}>
          <p className="ap-eyebrow mb-8 flex items-center gap-3 text-ash-800/70">
            <span aria-hidden="true" className="h-px w-10 bg-ash-800/40" />
            Why AllPatels
          </p>
        </Reveal>

        <Reveal variant="up" delay={120} duration={1200}>
          <h2 className="max-w-6xl text-[clamp(2.5rem,9vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.035em] text-ash-800">
            More than what you wear.
          </h2>
        </Reveal>

        {/* Image band */}
        <Reveal variant="clip" duration={1300} delay={180} className="mt-14 sm:mt-20">
          <ParallaxImage
            src={slotUrl("brandStory", { width: 2000, aspect: "wide" })}
            alt="Inside the AllPatels studio"
            aspect="wide"
            strength={40}
            sizes="100vw"
          />
        </Reveal>

        <div className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-8">
          <Reveal variant="up" delay={120} className="lg:col-span-5">
            <p className="font-display text-[1.5rem] leading-[1.35] text-ash-800 sm:text-[1.75rem]">
              We believe clothing should earn its place in your life — not the other
              way around.
            </p>
          </Reveal>

          <Reveal variant="up" delay={220} className="lg:col-span-5 lg:col-start-8">
            <div className="ap-body space-y-4 text-ash-800/75">
              <p>
                AllPatels began with a simple frustration: beautiful clothes that
                lasted one season. So we started at the other end — choosing fabrics
                first, building small runs, and designing pieces that get better
                the longer you wear them.
              </p>
              <p>
                We would rather make a hundred things you keep than a thousand you
                replace. That is the whole idea.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal variant="up" delay={320} className="mt-12">
          <Button href="/about" variant="primary" size="lg" withArrow>
            Our story
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
