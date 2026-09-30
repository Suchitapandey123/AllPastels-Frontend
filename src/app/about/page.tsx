import type { Metadata } from "next";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { slotUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "AllPatels began with a frustration: beautiful clothes that lasted one season. Here is how we decided to do it differently.",
};

const PRINCIPLES = [
  {
    title: "Fabric before silhouette",
    body: "We choose the cloth first, then cut. If a fabric will not improve with washing, it does not go into the range — which is why our linen and merino pieces look better after a year.",
  },
  {
    title: "Fewer, more considered",
    body: "We release in small runs rather than seasonal drops. A piece stays in the wardrobe longer, and we can afford to check the seams properly before it leaves us.",
  },
  {
    title: "Colour that works together",
    body: "Every tone in the AllPatels palette is designed to sit alongside the others. Buying one new piece should make the five you already own work harder.",
  },
  {
    title: "Honest construction",
    body: "We publish the full composition and care instructions for every product, because a garment you understand is easier to keep for longer.",
  },
];

const TIMELINE = [
  {
    year: "The beginning",
    body: "AllPatels started in a small studio with one linen dress that kept getting compliments. We could not find the second one anywhere, so we started making them ourselves.",
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
      {/* Header */}
      <section className="bg-ash-400">
        <Container>
          <div className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
            <div>
              <Reveal variant="up">
                <p className="ap-eyebrow mb-5 flex items-center gap-3 text-ash-800/70">
                  <span aria-hidden="true" className="h-px w-8 bg-ash-800/40" />
                  Our story
                </p>
                <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] text-ash-800">
                  More than what you wear.
                </h1>
                <p className="ap-body mt-7 max-w-lg text-lg text-ash-800/75">
                  We started AllPatels because we were tired of loving clothes that
                  stopped being wearable within a season. So we built a brand around
                  making less, better — out of fabrics that get better the more you
                  live in them.
                </p>
              </Reveal>
            </div>

            <Reveal variant="clip" duration={1200}>
              <ParallaxImage
                src={slotUrl("brandStory", { width: 1200, aspect: "portrait" })}
                alt="Inside the AllPatels studio"
                aspect="portrait"
                strength={26}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <Section space="default" tone="canvas">
        <SectionHeading
          eyebrow="How we work"
          title="Four things we hold to"
          description="These shape every decision from which fabric we source to when we retire a style."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} variant="up" delay={(index % 2) * 120}>
              <article className="border-t border-line pt-7">
                <p className="ap-eyebrow mb-3 text-burnt">0{index + 1}</p>
                <h2 className="text-2xl">{principle.title}</h2>
                <p className="ap-body mt-4 max-w-md text-ink/70">{principle.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section space="default" tone="surface" id="journal">
        <SectionHeading eyebrow="How we got here" title="The story so far" />

        <ol className="mt-12 flex flex-col">
          {TIMELINE.map((entry, index) => (
            <Reveal key={entry.year} variant="up" delay={index * 100}>
              <li className="grid gap-4 border-b border-line py-8 sm:grid-cols-[200px_1fr] sm:gap-8">
                <p className="ap-eyebrow text-burnt">{entry.year}</p>
                <p className="ap-body max-w-2xl text-lg text-ink/75">{entry.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Careers */}
      <Section space="default" tone="canvas" id="careers">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="up">
            <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt">
              <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
              Careers
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)]">Work with us</h2>
            <p className="ap-body mt-5 max-w-md text-ink/70">
              We are a small team and we hire slowly. If you care about construction,
              fabric and the details that make clothing last, we would like to hear
              from you.
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
              src={slotUrl("brandStorySecondary", { width: 1100, aspect: "landscape" })}
              alt="Fabric swatches and pattern tables at AllPatels"
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
