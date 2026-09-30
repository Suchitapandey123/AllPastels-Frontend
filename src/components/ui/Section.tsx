import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Section — the standard vertical band on the homepage.
 *
 * Owns the vertical rhythm (padding + background) so no individual section
 * has to think about spacing, and so alternate bands can be created purely
 * by changing a variant.
 */

type Tone = "canvas" | "surface" | "ash" | "cotton" | "burnt" | "ink";

const TONES: Record<Tone, string> = {
  canvas: "bg-floral-400",
  surface: "bg-ash-50",
  ash: "bg-ash-400",
  cotton: "bg-cotton-400",
  burnt: "bg-burnt-400",
  ink: "bg-ash-800",
};

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  /** Vertical padding. `tight` for dense grids, `loose` for editorial bands. */
  space?: "tight" | "default" | "loose" | "none";
  className?: string;
  id?: string;
  /** Set false for bands that manage their own full-bleed container. */
  contained?: boolean;
  as?: "section" | "div";
}

const SPACING = {
  none: "",
  tight: "py-14 sm:py-16",
  default: "py-16 sm:py-20 lg:py-24",
  loose: "py-20 sm:py-28 lg:py-36",
} as const;

export function Section({
  children,
  tone = "canvas",
  space = "default",
  className,
  id,
  contained = true,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn(TONES[tone], SPACING[space], className)}>
      {contained ? <Container>{children}</Container> : children}
    </Tag>
  );
}
