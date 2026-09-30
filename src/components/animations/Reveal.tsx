"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveal — animates its children into view once, on scroll.
 *
 * The animation itself is pure CSS (see the `[data-reveal]` rules in
 * `globals.css`). This component only observes visibility and flips an
 * attribute, so a reduced-motion visitor simply never sees movement.
 */

type RevealVariant = "up" | "left" | "clip" | "scale";

interface RevealProps {
  children: ReactNode;
  /** Direction of the entrance. Defaults to a gentle rise. */
  variant?: RevealVariant;
  /** Delay in ms before the transition starts. */
  delay?: number;
  /** Distance travelled, in px. */
  distance?: number;
  duration?: number;
  as?: ElementType;
  className?: string;
  id?: string;
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  distance,
  duration,
  as: Tag = "div",
  className,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reveal = () => {
      node.dataset.revealed = "true";
    };

    // Without IntersectionObserver, show the content immediately rather
    // than leaving it permanently invisible.
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      // threshold 0 + a small negative bottom margin reveals as soon as any
      // part of the element enters the viewport. A higher threshold left very
      // large editorial elements (full-width images, oversized type) stuck at
      // opacity 0 because 12% of a tall element can sit below the fold.
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(node);

    // Safety net: if the observer has not fired shortly after mount, reveal
    // anything that is within the viewport. Content must never be left
    // permanently invisible because of an animation.
    const failsafe = window.setTimeout(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal();
    }, 400);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const style: Record<string, string> = {};
  if (delay) style["--reveal-delay"] = `${delay}ms`;
  if (duration) style["--reveal-duration"] = `${duration}ms`;
  if (variant === "up" && distance) style["--reveal-y"] = `${distance}px`;
  if (variant === "left" && distance) style["--reveal-x"] = `${-Math.abs(distance)}px`;
  if (variant === "scale" && distance) style["--reveal-scale"] = String(distance);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      data-reveal={variant}
      data-revealed="false"
      style={style}
      className={className}
    >
      {children}
    </Tag>
  );
}
