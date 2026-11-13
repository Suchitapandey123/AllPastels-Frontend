import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  ConciergeNote,
  ContactChannels,
} from "@/components/contact/ContactChannels";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the AllPastels team about orders, sizing, returns or anything else. We reply within one working day.",
};

const TICKER = [
  "Sizing advice",
  "Order help",
  "Easy 15-day returns",
  "Gifting",
  "Wholesale",
  "Fabric questions",
];

const QUICK = [
  {
    q: "Where is my order?",
    a: "Live tracking sits on the FAQ page — all you need is your order id.",
    href: "/faq#tracking",
  },
  {
    q: "How do returns work?",
    a: "15 days, doorstep pickup, refund to source in 3–5 days.",
    href: "/faq#returns",
  },
  {
    q: "What size should I pick?",
    a: "Tell us your usual size and the piece — we reply with a real recommendation.",
    href: "/faq#shipping",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero — full pastel, no black. Blobs tucked behind type, right side
          is one quiet card so nothing collides with the surprise bubble. */}
      <section className="relative overflow-hidden bg-floral">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -top-20 left-[30%] h-56 w-56 rounded-full bg-powder/40 blur-3xl" />
          <span className="absolute right-[22%] top-10 h-52 w-52 rounded-full bg-cotton/50 blur-3xl" />
          <span className="absolute -bottom-24 left-[-2%] h-64 w-64 rounded-full bg-ash/60 blur-3xl" />
        </div>
        <Container
          width="wide"
          className="relative pb-16 pt-12 sm:pb-20 sm:pt-16"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.55fr_0.85fr]">
            <div>
              <p className="flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-burnt">
                <span aria-hidden="true" className="h-px w-10 bg-burnt/60" />
                Replies within one working day
              </p>
              <h1 className="font-display mt-5 text-[clamp(2.6rem,6vw,5.2rem)] leading-[1.0] tracking-[-0.02em] text-burnt-100">
                Write to us
                <br />
                <em className="font-light text-burnt">
                  like you’d write a friend.
                </em>
              </h1>
              <p className="mt-5 max-w-[48ch] text-[0.98rem] leading-relaxed text-burnt-100/70">
                Sizing doubts, an order question, a gift you need by Friday —
                tell us in your own words. A person at the Jaipur studio reads
                every note and answers it.
              </p>
            </div>

            <div className="max-w-sm rounded-[16px] border border-burnt-100/15 bg-floral-900/90 p-5 backdrop-blur lg:justify-self-end lg:w-full">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-burnt opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-burnt" />
                </span>
                <p className="text-[0.85rem] font-medium text-burnt-100">
                  Studio is open now · till 6pm IST
                </p>
              </div>
              <div aria-hidden="true" className="mt-4 flex items-center">
                {["#c5d1b3", "#ffc5c2", "#f3a39a", "#dc7954", "#ffa32a"].map(
                  (c, i) => (
                    <span
                      key={c}
                      className="h-9 w-9 rounded-full border-2 border-floral-900"
                      style={{
                        backgroundColor: c,
                        marginLeft: i === 0 ? 0 : -10,
                      }}
                    />
                  ),
                )}
              </div>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-burnt-100/60">
                Five pastels, one studio — Mon to Sat, Jaipur.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Ribbon — sage band, single motion moment */}
      <div className="overflow-hidden border-y border-burnt-100/15 bg-ash py-3">
        <div className="ap-anim-marquee flex w-max items-center gap-8 whitespace-nowrap pr-8 motion-reduce:animate-none">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-8 text-[0.85rem] font-medium text-burnt-100"
            >
              {item}
              <span aria-hidden="true" className="text-[0.7rem] text-burnt">
                ✳
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main — letter on the left, pastel ledger on the right */}
      <section className="bg-floral">
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="grid items-start gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
            <Reveal variant="up">
              <ContactForm />
            </Reveal>
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <Reveal variant="up" delay={120}>
                <ContactChannels />
              </Reveal>
              <Reveal variant="up" delay={200}>
                <ConciergeNote />
              </Reveal>
            </div>
          </div>

          {/* Quick answers — plain ledger rows, not cards */}
          <Reveal variant="up" className="mt-14 sm:mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-burnt-100/15 pt-8">
              <h2 className="font-display text-[1.7rem] leading-none text-burnt-100">
                Quicker than writing?
              </h2>
              <a
                href="/faq"
                className="text-[0.88rem] font-medium text-burnt-100 underline decoration-burnt decoration-2 underline-offset-[6px] transition-colors hover:text-burnt"
              >
                Browse all FAQs
              </a>
            </div>
            <ul className="mt-2 divide-y divide-burnt-100/10 border-b border-burnt-100/15">
              {QUICK.map((item) => (
                <li key={item.q}>
                  <a
                    href={item.href}
                    className="group grid gap-1 py-5 transition-colors sm:grid-cols-[240px_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <span className="font-display text-[1.1rem] text-burnt-100">
                      {item.q}
                    </span>
                    <span className="max-w-[56ch] text-[0.9rem] leading-relaxed text-burnt-100/60">
                      {item.a}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden text-[1.1rem] text-burnt transition-transform duration-300 group-hover:translate-x-1 sm:block"
                    >
                      ↳
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
