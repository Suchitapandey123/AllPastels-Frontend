import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { slotUrl } from "@/lib/images";

/**
 * EditorialSection — the fashion-editorial spread.
 *
 * A two-column magazine spread rather than a headline stacked above a photo:
 * the photograph leads on the left with a small, rotated detail print tucked
 * into its lower corner, and the philosophy copy sits in the right-hand
 * column, centred against the image. One container, one grid — so the band
 * reads as a single composition instead of two stacked halves.
 *
 * The headline is deliberately one step below the hero in the type scale
 * (4rem cap against the hero's 5rem) and carries no manual indent, so it sets
 * a confident editorial beat without out-weighing the page's opening
 * statement — and, with no ragged indent, it can never be clipped at narrow
 * widths. It is the only headline in the band, so the eye has one entry point.
 *
 * On phones the copy leads and the photograph follows, which keeps the reading
 * order sensible once the grid collapses to a single column.
 */

export function EditorialSection() {
  return (
    <section className="relative overflow-hidden bg-floral py-20 sm:py-28 lg:py-36">
      {/* Two soft pastel auras — warmth on the right, blush balance on the left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-cotton-800/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-powder-800/40 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Copy — first in the DOM so it leads on phones. On large screens it
              is placed explicitly in columns 8–12, opposite the photograph. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-5 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                Our philosophy
              </p>
            </Reveal>

            <Reveal variant="up" delay={100}>
              <h2 className="text-[clamp(2.25rem,4.8vw,4rem)] leading-[1.05] tracking-[-0.025em] text-ink">
                Made for
                <br />
                <span className="italic text-burnt">your moments.</span>
              </h2>
            </Reveal>

            <Reveal variant="up" delay={180}>
              <p className="mt-7 font-display text-[1.25rem] leading-[1.4] text-ink sm:text-[1.375rem]">
                We make the pieces you reach for without thinking — and keep making
                them, season after season, until they are yours.
              </p>
            </Reveal>

            <Reveal variant="up" delay={260}>
              <div className="ap-body mt-6 space-y-4 text-ink/70">
                <p>
                  Every AllPastels piece starts with a question: will someone still be
                  wearing this in five years? If the answer is no, we do not make it.
                </p>
                <p>
                  That means fewer drops, natural fabrics, and colourways chosen to sit
                  together in a wardrobe rather than compete with it.
                </p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={340}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button href="/shop" variant="primary" size="lg" withArrow>
                  Shop the edit
                </Button>
                <Button href="/about" variant="outline" size="lg" withArrow>
                  Read our story
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Photograph — tucked detail print on its lower-left, into the page
              margin, so it never collides with the copy column. */}
          <div className="relative lg:col-span-6 lg:col-start-1 lg:row-start-1">
            <Reveal variant="clip" duration={1300}>
              <ParallaxImage
                src={slotUrl("editorial", { width: 1400, aspect: "editorial" })}
                alt="AllPastels pieces photographed in soft daylight"
                aspect="editorial"
                strength={34}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>

            <Reveal
              variant="scale"
              delay={260}
              className="absolute -bottom-8 -left-6 z-20 hidden w-36 lg:block xl:w-44"
            >
              <div className="rotate-[-5deg] bg-floral p-2 shadow-xl">
                <ParallaxImage
                  src={slotUrl("editorialSecondary", { width: 700, aspect: "square" })}
                  alt="A detail of AllPastels natural fabric and stitching"
                  aspect="square"
                  strength={0}
                  sizes="(max-width: 1280px) 144px, 176px"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
