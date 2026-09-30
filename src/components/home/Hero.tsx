"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { slotUrl } from "@/lib/images";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Hero — the cinematic opening frame of the homepage.
 *
 * Deliberately not a carousel. A single full-bleed fashion image, one
 * editorial headline and two calls to action. The sequence is:
 *
 *   1. the photograph settles from a slight zoom
 *   2. the headline rises
 *   3. the supporting line follows
 *   4. the buttons arrive last
 *
 * A slow parallax drift runs underneath, offset by scroll position, so the
 * image feels present rather than fixed. All of it is CSS-driven and is
 * skipped for visitors who prefer reduced motion.
 */

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image || reduceMotion) return;

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0) return;
      // Positive while scrolling down, clamped so the image never drifts out.
      const progress = Math.max(-1, Math.min(1, rect.top / window.innerHeight));
      image.style.transform = `translate3d(0, ${progress * 9}%, 0)`;
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-ash-800 sm:min-h-[85vh] lg:min-h-[92vh]"
      aria-labelledby="hero-heading"
    >
      {/* Photograph */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={imageRef}
          className="ap-anim-hero relative h-[112%] w-full will-change-transform"
        >
          <Image
            src={slotUrl("hero", { width: 2200, aspect: "landscape" })}
            alt="A model wearing the new AllPatels season in soft natural light"
            fill
            // The hero is the LCP element, so it is preloaded in <head>.
            // Note: `priority` is deprecated in Next.js 16 in favour of `preload`.
            preload
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Keeps the type legible over the photograph without flattening it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ash-800/80 via-ash-800/25 to-ash-800/35" />
      </div>

      {/* Content */}
      <div className="relative w-full px-5 pb-14 pt-32 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="max-w-3xl">
            <p
              className="ap-anim-fade ap-eyebrow mb-6 flex items-center gap-3 text-cotton-400"
              style={{ animationDelay: "200ms" }}
            >
              <span aria-hidden="true" className="h-px w-10 bg-cotton-400/70" />
              Autumn / Winter Edit
            </p>

            <h1
              id="hero-heading"
              className="ap-anim-rise text-[clamp(3rem,11vw,8rem)] font-normal leading-[0.92] tracking-[-0.03em] text-floral-400"
              style={{ animationDelay: "380ms" }}
            >
              Every day,
              <br />
              <span className="italic text-cotton-400">elevated.</span>
            </h1>

            <p
              className="ap-anim-rise ap-body mt-7 max-w-md text-floral-200/90 sm:text-lg"
              style={{ animationDelay: "620ms" }}
            >
              Discover pieces designed for the way you live, move and express yourself.
            </p>

            <div
              className="ap-anim-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              style={{ animationDelay: "800ms" }}
            >
              <Button href="/new-arrivals" variant="primary" size="lg" withArrow className="sm:w-auto">
                Shop new
              </Button>
              <Button
                href="/collections"
                variant="light"
                size="lg"
                withArrow
                className="border-transparent bg-transparent text-floral-200 hover:bg-floral-400/15 sm:w-auto"
              >
                Explore collection
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="ap-anim-fade pointer-events-none absolute bottom-6 right-5 hidden items-center gap-3 text-floral-200/70 sm:right-8 lg:right-12 lg:flex"
        style={{ animationDelay: "1200ms" }}
      >
        <span className="ap-eyebrow">Scroll</span>
        <span aria-hidden="true" className="block h-px w-14 bg-floral-200/40" />
      </div>
    </section>
  );
}
