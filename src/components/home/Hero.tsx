import Link from "next/link";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { slotUrl } from "@/lib/images";

/**
 * Hero — the opening band of the homepage.
 *
 * A split composition rather than a full-bleed carousel: the words lead on
 * the left, the photograph carries the right. This keeps the brand's
 * editorial voice (AllPastels) while giving the merchandising the page needs —
 * a floating "350+ styles" caption and a round "New in" badge echo the
 * category-first shopping behaviour of modern commerce homepages, without
 * turning the hero into a banner grid.
 *
 * Soft pastel auras (Cotton Rose / Powder Blush / Ash Grey) sit behind the
 * content so the band feels warm and playful before a single product is shown.
 * The primary photograph is the LCP element and is preloaded.
 *
 * Service promises (shipping, returns, fabrics) live in the footer rather than
 * here, so the hero stays uncluttered and nothing is stated twice on the page.
 */

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-floral" aria-labelledby="hero-heading">
      {/* Pastel aura — soft tonal depth, never a gradient over the photography. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-cotton-700/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-ash-800/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-powder-800/50 blur-3xl"
      />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Copy */}
          <div className="lg:col-span-5">
            <p className="ap-anim-fade mb-5 flex items-center gap-3 text-burnt">
              <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
              Autumn / Winter Edit
            </p>

            <h1
              id="hero-heading"
              className="ap-anim-rise text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink"
              style={{ animationDelay: "120ms" }}
            >
              Every day,
              <br />
              <span className="italic text-burnt">elevated.</span>
            </h1>

            <p
              className="ap-anim-rise ap-body mt-6 max-w-md text-ink/70"
              style={{ animationDelay: "320ms" }}
            >
              Thoughtfully designed pieces for everyday style, occasions and everything in
              between — made in small runs from natural fabrics.
            </p>

            <div
              className="ap-anim-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              style={{ animationDelay: "480ms" }}
            >
              <Button href="/new-arrivals" variant="primary" size="lg" withArrow>
                Shop new
              </Button>
              <Button href="/collections" variant="outline" size="lg" withArrow>
                Explore collections
              </Button>
            </div>
          </div>

          {/* Media */}
          <div className="lg:col-span-7">
            <Reveal variant="clip" duration={1200}>
              <div className="relative">
                <ParallaxImage
                  src={slotUrl("hero", { width: 1800, aspect: "landscape" })}
                  alt="A model wearing the new AllPastels season in soft natural light"
                  aspect="landscape"
                  strength={26}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  preload
                />

                {/* Round badge — nods to the category-first behaviour of modern commerce homepages. */}
                <div className="absolute -right-3 -top-3 grid h-20 w-20 rotate-6 place-items-center rounded-full bg-burnt text-center leading-tight text-floral-900 shadow-lg sm:h-24 sm:w-24">
                  <span className="ap-eyebrow">
                    New
                    <br />
                    in
                  </span>
                </div>

                {/* Floating caption card — the merchandising cue from the hero banner. */}
                <Link
                  href="/new-arrivals"
                  className="group absolute bottom-4 left-4 flex items-center gap-4 rounded-2xl bg-floral/95 px-4 py-3 shadow-md backdrop-blur-sm transition-colors duration-500 hover:bg-floral sm:bottom-5 sm:left-5 sm:px-5 sm:py-4"
                >
                  <span>
                    <span className="ap-eyebrow block text-ink/50">Comfy jogger sets</span>
                    <span className="mt-1 block text-sm text-ink">350+ styles</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-burnt transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
