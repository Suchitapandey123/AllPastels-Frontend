"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * StaggerGrid — reveals its direct children one after another when the grid
 * scrolls into view.
 *
 * Deliberately renders no extra DOM: the element you pass `className` to
 * *is* the grid, so the stagger targets the real product cards. Per-child
 * delays are computed in CSS with `:nth-child` rules (see `globals.css`),
 * driven by the `--stagger-step` custom property set here.
 */

interface StaggerGridProps {
  children: ReactNode;
  /** Milliseconds between each child. */
  step?: number;
  /** Cap on the accumulated delay, so long grids don't crawl. */
  maxDelay?: number;
  className?: string;
}

export function StaggerGrid({ children, step = 90, maxDelay = 700, className }: StaggerGridProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.revealed = "true";
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
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(node);

    // Safety net — a grid must never be left permanently invisible because
    // the observer did not fire (e.g. it mounted inside a horizontally
    // scrolled rail, off to the side).
    const failsafe = window.setTimeout(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        node.dataset.revealed = "true";
      }
    }, 400);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-stagger
      data-revealed="false"
      style={
        {
          "--stagger-step": `${step}ms`,
          "--stagger-max": `${maxDelay}ms`,
        } as React.CSSProperties
      }
      className={cn(className)}
    >
      {children}
    </div>
  );
}

