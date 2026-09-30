"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ASPECT, type AspectKey } from "@/lib/images";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * ParallaxImage — a next/image that drifts within its frame as the page
 * scrolls, giving large editorial images a sense of depth.
 *
 * Implementation notes:
 * - The image is rendered oversized (`scale(1.18)`) so translating it never
 *   exposes an empty edge.
 * - Scroll work is batched into a single rAF per frame and driven by
 *   passive listeners, so it never blocks interaction.
 * - With `prefers-reduced-motion` the effect is skipped entirely and a plain
 *   image is rendered.
 */

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Maximum travel in pixels. Keep modest — this should be felt, not seen. */
  strength?: number;
  aspect?: AspectKey;
  sizes?: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
  /** Overlays a soft brand-tinted gradient to keep text legible on top. */
  overlay?: "none" | "bottom" | "full";
}

const OVERLAY_STYLES: Record<NonNullable<ParallaxImageProps["overlay"]>, string> = {
  none: "",
  bottom: "bg-gradient-to-t from-ash-800/70 via-ash-800/15 to-transparent",
  full: "bg-gradient-to-t from-ash-800/80 via-ash-800/25 to-ash-800/10",
};

export function ParallaxImage({
  src,
  alt,
  strength = 40,
  aspect = "portrait",
  sizes = "(max-width: 768px) 100vw, 50vw",
  preload = false,
  className,
  imageClassName,
  overlay = "none",
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const motionAllowed = useReducedMotion();

  useEffect(() => {
    if (!motionAllowed || strength === 0) return;

    const frame = frameRef.current;
    if (!frame) return;

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const rect = frame.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // Progress from -1 (below the fold) to 1 (above the fold).
      const centre = rect.top + rect.height / 2;
      const progress = (viewport / 2 - centre) / (viewport / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      setOffset(clamped * strength);
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [motionAllowed, strength]);

  const ratio = ASPECT[aspect];

  return (
    <div
      ref={frameRef}
      className={cn("relative overflow-hidden bg-ash-100", className)}
      style={{ aspectRatio: `${ratio.width} / ${ratio.height}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn(
          "object-cover will-change-transform",
          motionAllowed && strength > 0 && "scale-[1.18]",
          imageClassName,
        )}
        style={
          {
            transform: motionAllowed && strength > 0 ? `translate3d(0, ${offset}px, 0)` : undefined,
          } as CSSProperties
        }
      />
      {overlay !== "none" && (
        <div className={cn("pointer-events-none absolute inset-0", OVERLAY_STYLES[overlay])} />
      )}
    </div>
  );
}
