import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/data/site";

/**
 * SignedOutGate — what /account shows without a session.
 *
 * A two-column editorial spread rather than a decorated card. The masthead
 * rule anchors the section to the same baseline grid as the signed-in
 * header; the left column carries the statement and the two routes out
 * (sign in, create account), while the right column — divided by a single
 * hairline — holds a quiet numbered index of what membership keeps for you.
 *
 * The hierarchy comes from type, whitespace and the border system the rest
 * of the site already speaks, so there are no motifs, arches or floating
 * shapes to keep in sync — and the composition simply collapses to one
 * readable column on phones, statement first.
 */

const PERKS = [
  {
    title: "Orders & tracking",
    detail: "Order history, dispatch updates and returns, all in one place.",
  },
  {
    title: "Saved addresses",
    detail: "Your details ready for a one-step checkout.",
  },
  {
    title: "Wishlist",
    detail: "The pieces you have kept, alongside everything else.",
  },
];

export function SignedOutGate() {
  return (
    <section className="bg-floral">
      <Container className="pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
        {/* Masthead — label left, house line right, closed by a hairline. */}
        <div className="ap-anim-fade flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-5">
          <p className="ap-eyebrow flex items-center gap-3 text-burnt">
            <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
            AllPastels Members
          </p>
          <p className="ap-eyebrow hidden text-ink/40 sm:block">{SITE.tagline}</p>
        </div>

        <div className="mt-10 grid gap-12 sm:mt-14 lg:mt-16 lg:grid-cols-12 lg:gap-x-0">
          {/* Statement — leads at every width, so the headline is the first read. */}
          <div className="ap-anim-rise lg:col-span-7 lg:pr-14">
            <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.03em]">
              Your account,
              <br className="hidden sm:block" />{" "}
              <em className="font-light italic text-burnt">waiting for you</em>.
            </h1>

            <p className="ap-body mt-6 max-w-xl text-ink/65 sm:mt-7">
              Orders, addresses and the pieces you have saved — all waiting where
              you left them.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/login" variant="primary" size="lg" withArrow>
                Sign in
              </Button>
              <Button href="/signup" variant="outline" size="lg" withArrow>
                Create account
              </Button>
            </div>

            <p className="ap-body mt-5 max-w-md text-sm text-ink/50">
              Ten seconds to open — and everything is right here when you come
              back.
            </p>
          </div>

          {/* Index — what an account quietly keeps hold of. */}
          <div
            className="ap-anim-rise lg:col-span-5 lg:border-l lg:border-line lg:pl-14"
            style={{ animationDelay: "140ms" }}
          >
            <h2 className="ap-eyebrow text-ink/45">What membership holds</h2>

            <ul className="mt-6 border-t border-line">
              {PERKS.map((perk, index) => (
                <li
                  key={perk.title}
                  className="group flex items-baseline gap-5 border-b border-line py-5 transition-colors duration-300 hover:bg-surface"
                >
                  <span className="ap-eyebrow shrink-0 text-burnt/60 transition-colors duration-300 group-hover:text-burnt">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-snug">{perk.title}</p>
                    <p className="ap-body mt-1 text-sm text-ink/60">{perk.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
