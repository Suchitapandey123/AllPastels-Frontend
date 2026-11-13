import type { Metadata } from "next";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { slotUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "AllPastels began with a frustration: beautiful clothes that lasted one season. Here is how we decided to do it differently.",
};

const PRINCIPLES = [
  {
    title: "Fabric before silhouette",
    body: "We choose the cloth first, then cut. If a fabric will not improve with washing, it does not go into the range — which is why our linen and merino pieces look better after a year.",
    swatch: "#c5d1b3",
  },
  {
    title: "Fewer, more considered",
    body: "We release in small runs rather than seasonal drops. A piece stays in the wardrobe longer, and we can afford to check the seams properly before it leaves us.",
    swatch: "#ffc5c2",
  },
  {
    title: "Colour that works together",
    body: "Every tone in the AllPastels palette is designed to sit alongside the others. Buying one new piece should make the five you already own work harder.",
    swatch: "#f3a39a",
  },
  {
    title: "Honest construction",
    body: "We publish the full composition and care instructions for every product, because a garment you understand is easier to keep for longer.",
    swatch: "#dc7954",
  },
];

const TIMELINE = [
  {
    year: "The beginning",
    body: "AllPastels started in a small studio with one linen dress that kept getting compliments. We could not find the second one anywhere, so we started making them ourselves.",
  },
  {
    year: "Learning to scale",
    body: "We learned that the hardest part was not designing more, but making the same piece properly, repeatedly — which meant smaller runs and closer relationships with our makers.",
  },
  {
    year: "Where we are now",
    body: "Today we make considered clothing for women, men and kids, in natural fabrics, in small runs. The scale is different; the principle is not.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Masthead — ledger row, oversized statement, studio portrait.
          One bold move: the headline set at poster scale against the
          portrait; everything below stays quiet. */}
      <section className="relative overflow-hidden bg-floral">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -top-20 left-[35%] h-56 w-56 rounded-full bg-powder/40 blur-3xl" />
          <span className="absolute -bottom-24 right-[-2%] h-64 w-64 rounded-full bg-ash/60 blur-3xl" />
        </div>
        <Container width="wide" className="relative pb-14 pt-10 sm:pb-20 sm:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ink/15 py-3 text-[0.78rem] text-ink/60">
            <p>Our story</p>
            <p className="hidden sm:block">Jaipur studio · natural fabrics</p>
            <p>Small runs, made to last</p>
          </div>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.5fr_0.85fr] lg:gap-14">
            <div className="min-w-0 pt-2">
              <Reveal variant="up">
                <h1 className="text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.0] tracking-[-0.02em] text-ink">
                  More than
                  <br />
                  <em className="font-light text-burnt">what you wear.</em>
                </h1>
                <p className="mt-6 max-w-[52ch] text-[1.02rem] leading-relaxed text-ink/70 first-letter:font-display first-letter:text-[2.6em] first-letter:leading-[0.9] first-letter:float-left first-letter:mr-2 first-letter:text-burnt">
                  We started AllPastels because we were tired of loving clothes
                  that stopped being wearable within a season. So we built a
                  brand around making less, better — out of fabrics that get
                  better the more you live in them.
                </p>
              </Reveal>
            </div>

            <Reveal
              variant="clip"
              duration={1200}
              className="max-w-[320px] lg:justify-self-end lg:w-full"
            >
              <div
                aria-hidden="true"
                className="h-[6px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #c5d1b3 0 18px, #ffc5c2 18px 36px, #f3a39a 36px 54px, #dc7954 54px 72px)",
                }}
              />
              <ParallaxImage
                src={slotUrl("editorial", { width: 1000, aspect: "editorial" })}
                alt="AllPastels editorial look in soft natural light"
                aspect="editorial"
                strength={22}
                sizes="(max-width: 1024px) 100vw, 32vw"
                preload
              />
              <p className="mt-3 text-[0.8rem] leading-relaxed text-ink/50">
                Cut from cloth that gets better with every wash.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Principles — a fabric ledger, not numbered steps. The swatch dot is
          the marker: each principle carries its palette tone, so the section
          reads as the colour story, not a generic 01–04 grid. */}
      <Section space="default" tone="canvas">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-ink">
            Four things we hold to
          </h2>
          <p className="ap-body mt-5 max-w-xl text-ink/70">
            These shape every decision from which fabric we source to when we
            retire a style.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/15">
          {PRINCIPLES.map((principle, index) => (
            <Reveal
              key={principle.title}
              as="li"
              variant="up"
              delay={(index % 2) * 100}
            >
              <article className="grid gap-3 py-8 sm:grid-cols-[28px_240px_1fr] sm:items-baseline sm:gap-6">
                <span
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 rounded-full border border-ink/15 sm:mt-1.5"
                  style={{ backgroundColor: principle.swatch }}
                />
                <h3 className="font-display text-[1.3rem] leading-snug text-ink">
                  {principle.title}
                </h3>
                <p className="ap-body max-w-xl text-ink/70">{principle.body}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Story — chapters on a rail. A sequence, so markers earn their place. */}
      <Section space="default" tone="surface" id="journal">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-ink">
              The story so far
            </h2>
            <p className="ap-body mt-5 max-w-md text-ink/70">
              Three chapters, one principle throughout: make less, better.
            </p>
            <div className="mt-8 overflow-hidden">
              <ParallaxImage
                src={slotUrl("campaign", {
                  width: 1100,
                  aspect: "landscape",
                })}
                alt="AllPastels campaign look in soft daylight"
                aspect="landscape"
                strength={22}
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-ink/50">
              From the AllPastels lookbook.
            </p>
          </div>

          <ol className="relative flex flex-col gap-0 border-l border-ink/15 pl-8">
            {TIMELINE.map((entry, index) => (
              <Reveal key={entry.year} as="li" variant="up" delay={index * 100} className="relative py-7 first:pt-1 last:pb-1">
                <span
                  aria-hidden="true"
                  className="absolute -left-[37px] top-9 h-3 w-3 rounded-full border-2 border-surface bg-burnt first:top-3"
                />
                <p className="font-display text-[1.35rem] text-ink">
                  {entry.year}
                </p>
                <p className="ap-body mt-3 max-w-xl text-ink/70">{entry.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Careers — sage band, quiet close. */}
      <Section space="default" tone="ash" id="careers">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="up" className="min-w-0">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] text-ink">
              Work with us
            </h2>
            <p className="ap-body mt-5 max-w-md text-ink/70">
              We are a small team and we hire slowly. If you care about
              construction, fabric and the details that make clothing last, we
              would like to hear from you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="primary" size="md" withArrow>
                Get in touch
              </Button>
              <Button href="/shop" variant="outline" size="md" withArrow>
                See the collection
              </Button>
            </div>
          </Reveal>

          <Reveal variant="clip" delay={140} duration={1200}>
            <ParallaxImage
              src={slotUrl("brandStorySecondary", {
                width: 1100,
                aspect: "landscape",
              })}
              alt="Fabric swatches and pattern tables at AllPastels"
              aspect="landscape"
              strength={22}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
