"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";
import { testimonials } from "@/data/collections";
import { loadProducts } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Testimonials — customer reviews as a horizontal slider.
 *
 * Built natively with a scroll-snap container and button controls, so it
 * works with a mouse, a trackpad, a touch drag and the arrow keys without
 * any custom drag physics. `scrollBy` moves exactly one card at a time.
 */

const VISIBLE_DESKTOP = 3;
const CARD_GAP = 24;

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});

  useEffect(() => {
    let active = true;
    loadProducts().then((result) => {
      if (!active || !result.ok) return;
      const map: Record<string, Product> = {};
      result.products.forEach((product) => {
        map[product.slug] = product;
        map[product.id] = product;
      });
      setProductMap(map);
    });
    return () => {
      active = false;
    };
  }, []);

  // Derive the active card from the scroll position so the dots stay
  // truthful when the user swipes or uses a trackpad.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;
      setActiveIndex(Math.round(track.scrollLeft / (card.offsetWidth + CARD_GAP)));
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const maxIndex = Math.max(0, testimonials.length - VISIBLE_DESKTOP);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;

    const clamped = Math.max(0, Math.min(index, maxIndex));
    track.scrollTo({ left: clamped * (card.offsetWidth + CARD_GAP), behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <Section space="default" tone="canvas">
      <Reveal variant="up">
        <SectionHeading
          eyebrow="In their words"
          title="Loved and worn"
          description="Unedited notes from people who bought in, washed it, and kept wearing it."
        />
      </Reveal>

      <div className="relative mt-12">
        <ul
          ref={trackRef}
          tabIndex={0}
          className="ap-scroll-x -mx-5 flex snap-x snap-mandatory gap-6 px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
          aria-label="Customer reviews"
        >
          {testimonials.map((testimonial) => {
const product = testimonial.productSlug
  ? productMap[testimonial.productSlug]
  : undefined;

            return (
              <li
                key={testimonial.id}
                className="flex w-[85vw] shrink-0 snap-start flex-col justify-between bg-surface p-7 sm:w-[46vw] lg:w-[31.5%]"
              >
                <div>
                  <div className="flex items-center gap-1 text-burnt">
                    <span className="sr-only">
                      Rated {testimonial.rating} out of 5
                    </span>
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <StarIcon key={index} className="h-3.5 w-3.5" filled />
                    ))}
                  </div>

                  <blockquote className="mt-5">
                    <p className="font-display text-lg leading-[1.5] text-ink">
                      “{testimonial.quote}”
                    </p>
                  </blockquote>
                </div>

                <div className="mt-7 border-t border-line pt-5">
                  <p className="text-sm text-ink">{testimonial.author}</p>
                  <p className="ap-eyebrow mt-1 text-ink/40">{testimonial.location}</p>

                  {product && (
                    <Link
                      href={`/products/${product.slug}`}
                      className="ap-eyebrow mt-3 inline-flex items-center gap-1.5 text-burnt transition-opacity hover:opacity-70"
                    >
                      {product.name}
                      <ArrowRightIcon className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between gap-6">
          <ul className="flex items-center gap-2">
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={testimonial.id}>
                  <button
                    type="button"
                    onClick={() => scrollToCard(index)}
                    aria-label={`Go to review ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-1.5 transition-all duration-500",
                        isActive ? "w-8 bg-burnt" : "w-1.5 bg-ink/20 hover:bg-ink/40",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
            >
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
