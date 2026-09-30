import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { slotUrl } from "@/lib/images";

/**
 * EditorialSection — the fashion-editorial spread.
 *
 * Not a paragraph about the brand. Oversized display type, an off-centre
 * image and a deliberately asymmetric grid that leaves a column of empty
 * space, which is what makes the type feel set rather than typed.
 *
 * The two columns are deliberately misaligned vertically — the copy block
 * sits lower than the image on desktop, so the eye travels down and across
 * rather than scanning a neat row.
 */

export function EditorialSection() {
  return (
    <section className="relative overflow-hidden bg-floral-400 py-20 sm:py-28 lg:py-40">
      <Container>
        {/* Oversized statement type, cropped by the viewport on purpose. */}
        <Reveal variant="up" className="relative z-10">
          <h2 className="text-[clamp(3rem,13vw,11rem)] font-normal leading-[0.86] tracking-[-0.035em] text-ink">
            Made for
            <br />
            <span className="ml-[8vw] italic text-burnt sm:ml-[14vw]">your moments.</span>
          </h2>
        </Reveal>
      </Container>

      <Container className="relative z-10 mt-14 sm:mt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Image — deliberately offset */}
          <Reveal
            variant="clip"
            duration={1300}
            className="lg:col-span-7 lg:col-start-1"
          >
            <ParallaxImage
              src={slotUrl("editorial", { width: 1400, aspect: "editorial" })}
              alt="AllPatels pieces photographed in soft daylight"
              aspect="editorial"
              strength={34}
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </Reveal>

          {/* Copy — sits lower, in the narrower column */}
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9 lg:pb-4">
            <Reveal variant="up" delay={140}>
              <p className="ap-eyebrow mb-5 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                Our philosophy
              </p>
            </Reveal>

            <Reveal variant="up" delay={220}>
              <p className="font-display text-[1.375rem] leading-[1.4] text-ink sm:text-2xl">
                We make the pieces you reach for without thinking — and keep making
                them, season after season, until they are yours.
              </p>
            </Reveal>

            <Reveal variant="up" delay={300}>
              <div className="ap-body mt-7 max-w-md space-y-4 text-ink/70">
                <p>
                  Every AllPatels piece starts with a question: will someone still be
                  wearing this in five years? If the answer is no, we do not make it.
                </p>
                <p>
                  That means fewer drops, natural fabrics, and colourways chosen to sit
                  together in a wardrobe rather than compete with it.
                </p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={380} className="mt-9">
              <Button href="/about" variant="outline" size="md" withArrow>
                Read our story
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* A second, smaller photograph tucked into the negative space. */}
      <Reveal
        variant="scale"
        delay={200}
        className="relative z-0 mx-auto mt-16 hidden w-56 lg:mt-0 lg:block lg:w-64"
      >
        <ParallaxImage
          src={slotUrl("editorialSecondary", { width: 700, aspect: "square" })}
          alt="A detail of AllPatels natural fabric and stitching"
          aspect="square"
          strength={18}
          sizes="256px"
          className="rotate-[-4deg] shadow-lg"
        />
      </Reveal>
    </section>
  );
}
