import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/data/site";

/**
 * AuthShell — the shared editorial frame behind /login, /signup and the
 * password-reset screens.
 *
 * Composition: a masthead rule on top, then a two-column spread — the
 * statement (large heading + subtitle) on the left with, beneath it, a
 * numbered index of what membership holds and the closing brand voice;
 * the form alone on the right, divided from the rest by a single hairline
 * that runs the full height of the grid. On phones the grid reads
 * statement → form → index, so the form always arrives before the
 * supporting copy. Hierarchy comes from type, whitespace and the border
 * system — no motifs, panels or floating shapes.
 */

export interface AuthStep {
  number: string;
  title: string;
  detail: string;
}

interface AuthShellProps {
  /** Small uppercase label, in the masthead slot. */
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  /** Editorial copy that closes the left column. */
  story: { headline: ReactNode; body: string };
  steps: AuthStep[];
  children: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, story, steps, children }: AuthShellProps) {
  return (
    <section className="bg-floral">
      <Container className="pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
        {/* Masthead — page label left, house line right, closed by a hairline. */}
        <div className="ap-anim-fade flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-5">
          <p className="ap-eyebrow flex items-center gap-3 text-burnt">
            <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
            {eyebrow}
          </p>
          <p className="ap-eyebrow hidden text-ink/40 sm:block">{SITE.tagline}</p>
        </div>

        <div className="mt-10 grid gap-y-10 sm:mt-14 lg:mt-16 lg:grid-cols-12 lg:gap-x-0 lg:gap-y-0">
          {/* Statement */}
          <div className="ap-anim-rise lg:col-span-7 lg:pr-14">
            <h1 className="text-[clamp(2.4rem,5.5vw,3.75rem)] leading-[1.03] tracking-[-0.03em]">
              {title}
            </h1>
            <p className="ap-body mt-5 max-w-xl text-ink/65">{subtitle}</p>
          </div>

          {/* Form — spans both rows so the hairline runs the full height. */}
          <div
            className="ap-anim-rise lg:col-span-5 lg:row-span-2 lg:border-l lg:border-line lg:pl-14"
            style={{ animationDelay: "140ms" }}
          >
            {children}
          </div>

          {/* Index + closing voice */}
          <div className="lg:col-span-7 lg:mt-14 lg:pr-14">
            <p className="ap-eyebrow text-ink/45">What you get</p>
            <ul className="mt-5 border-t border-line">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className="group flex items-baseline gap-5 border-b border-line py-5 transition-colors duration-300 hover:bg-surface"
                >
                  <span className="ap-eyebrow shrink-0 text-burnt/60 transition-colors duration-300 group-hover:text-burnt">
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-snug">{step.title}</p>
                    <p className="ap-body mt-1 text-sm text-ink/60">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <p className="font-display text-[clamp(1.35rem,2vw,1.6rem)] leading-[1.35] text-ink">
                {story.headline}
              </p>
              <p className="ap-body mt-3 max-w-lg text-sm text-ink/60">{story.body}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
