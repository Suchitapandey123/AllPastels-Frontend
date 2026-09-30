import type { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about AllPatels shipping, returns, sizing, fabric care, gifting and tracking your order.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-line bg-ash-50">
        <Container>
          <div className="py-14 sm:py-20">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                Help
              </p>
              <h1 className="text-[clamp(2.25rem,5vw,4rem)]">
                Frequently asked questions
              </h1>
              <p className="ap-body mt-5 max-w-xl text-ink/70">
                Everything about shipping, returns, sizing and caring for your
                pieces. If your question is not here, we are happy to help.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section space="default" tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
          <div>
            <FaqAccordion />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-ash-400 p-7">
              <h2 className="text-xl text-ash-800">Still need help?</h2>
              <p className="ap-body mt-3 text-sm text-ash-800/75">
                Our team replies to every message within one working day — usually
                much sooner.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="/contact" variant="primary" size="sm" withArrow>
                  Contact us
                </Button>
                <a
                  href="mailto:care@allpatels.com"
                  className="ap-eyebrow border border-ash-800/30 px-6 py-3 text-center text-ash-800 transition-colors hover:border-ash-800"
                >
                  care@allpatels.com
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
