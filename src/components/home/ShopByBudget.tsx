import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PRICE_STEPS } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

/**
 * ShopByBudget — "Gifting, sorted".
 *
 * The price-first entry point: a handful of budget bands, each a direct link
 * into the filtered catalogue (`/shop?max=…`). Lifted from the "gifts under"
 * pattern of modern commerce homepages and rebuilt as a soft pastel panel so it
 * belongs to AllPastels rather than any reference site.
 *
 * The bands come from the catalogue's own `PRICE_STEPS`, so the section can
 * never drift out of sync with what the store actually sells.
 */

export function ShopByBudget() {
  return (
    <Section space="default" tone="surface">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cotton-800 via-floral to-powder-800 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal variant="up" className="lg:col-span-5">
            <p className="ap-eyebrow mb-5 flex items-center gap-3 text-burnt">
              <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
              Gifting, sorted
            </p>

            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] text-ink">Shop by budget</h2>

            <p className="ap-body mt-5 max-w-md text-ink/70">
              Presents that land well, whatever the number. Every order arrives gift
              wrapped, at no extra cost.
            </p>

            <div className="mt-8">
              <Button
                href="/collections?collection=gifting-edit"
                variant="primary"
                size="md"
                withArrow
              >
                Shop the gifting edit
              </Button>
            </div>
          </Reveal>

          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-6 lg:col-start-7">
            {PRICE_STEPS.map((max, index) => (
              <li key={max}>
                <Reveal variant="up" delay={index * 80} className="h-full">
                  <Link
                    href={`/shop?max=${max}`}
                    className="group flex h-full items-center justify-between gap-3 rounded-2xl bg-floral/85 px-5 py-5 ring-1 ring-floral transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-floral hover:shadow-lg sm:px-6 sm:py-6"
                  >
                    <span className="min-w-0">
                      <span className="ap-eyebrow block text-ink/50">Gifts</span>
                      <span className="mt-1 block font-display text-xl text-ink sm:text-2xl">
                        Under {formatPrice(max)}
                      </span>
                    </span>

                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-floral transition-colors duration-500 group-hover:bg-burnt">
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
