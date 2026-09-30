import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one place horizontal rhythm is defined. Every section, grid and
 * component aligns to this container, which is what makes the layout read
 * as a single designed system rather than a stack of pages.
 */

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  /** `wide` for full-bleed editorial bands, `narrow` for reading columns. */
  width?: "narrow" | "default" | "wide" | "full";
  className?: string;
  id?: string;
}

const WIDTHS = {
  narrow: "max-w-3xl",
  default: "max-w-[1400px]",
  wide: "max-w-[1680px]",
  full: "max-w-none",
} as const;

export function Container({
  children,
  as: Tag = "div",
  width = "default",
  className,
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        // 5rem keeps a full-bleed hero clear of the sticky header.
        width === "full" ? "" : WIDTHS[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
