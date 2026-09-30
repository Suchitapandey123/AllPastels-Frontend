import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The brand's single button primitive.
 *
 * Renders a `<Link>` for navigation and a `<button>` for actions, so the
 * right semantics come for free and keyboard behaviour stays correct.
 */

type Variant = "primary" | "secondary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  /** Burnt Peach — the one true call to action colour. */
  primary:
    "bg-burnt text-floral-50 border border-burnt hover:bg-burnt-500 hover:border-burnt-500 active:bg-burnt-600",
  /** Ash Grey — the quiet secondary action. */
  secondary:
    "bg-ash text-ash-800 border border-ash hover:bg-ash-300 active:bg-ash-400",
  /** Transparent with a hairline border. */
  outline:
    "bg-transparent text-ink border border-line hover:border-ash-800 hover:bg-ash-50",
  /** Text-only, for tertiary links. */
  ghost: "bg-transparent text-ink border border-transparent hover:text-burnt",
  /** For use on dark or photographic panels. */
  light: "bg-floral-400 text-ash-800 border border-floral-400 hover:bg-cotton-400 hover:border-cotton-400",
};

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.6875rem]",
  md: "px-7 py-3.5 text-xs",
  lg: "px-8 py-4 text-xs",
};

const BASE =
  "inline-flex items-center justify-center gap-2.5 uppercase tracking-[0.18em] font-medium " +
  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Optional trailing arrow — a recurring AllPatels motif. */
  withArrow?: boolean;
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
    >
      <path
        d="M3 10h13M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

type ButtonLinkProps = BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">;
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<ComponentProps<"button">, "className">;

export function Button(props: ButtonLinkProps | NativeButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    withArrow = false,
    ...rest
  } = props as BaseProps & Record<string, unknown>;

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  const content = (
    <>
      {children}
      {withArrow && <Arrow />}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={cn(classes, "group")} {...linkRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(classes, "group")} {...(rest as ComponentProps<"button">)}>
      {content}
    </button>
  );
}
