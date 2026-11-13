import { cn } from "@/lib/utils";

/**
 * Rating — a compact five-star row.
 *
 * Rendered as text plus decorative stars so it stays legible to screen
 * readers without announcing five separate images.
 */

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: "sm" | "md";
  tone?: "default" | "inverted";
  className?: string;
}

function Star({ fill, half }: { fill: number; half: boolean }) {
  const path = "M10 1.5l2.47 5.28 5.53.63-4.1 3.9 1.11 5.44L10 14.03 5 16.75l1.1-5.44L2 7.41l5.53-.63L10 1.5z";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={cn(
        "h-3.5 w-3.5",
        half ? "text-burnt" : fill > 0.5 ? "text-burnt" : "text-ink/15",
      )}
    >
      <defs>
        <linearGradient id={`star-${fill}-${half ? "h" : "f"}`}>
          <stop offset={`${Math.max(0, Math.min(100, fill * 100))}%`} stopColor="currentColor" />
          <stop
            offset={`${Math.max(0, Math.min(100, fill * 100))}%`}
            style={{ stopColor: "var(--color-ink)", stopOpacity: 0.15 }}
          />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#star-${fill}-${half ? "h" : "f"})`} />
    </svg>
  );
}

export function Rating({
  value,
  reviewCount,
  size = "sm",
  tone = "default",
  className,
}: RatingProps) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      aria-label={`Rated ${value.toFixed(1)} out of 5${reviewCount ? ` from ${reviewCount} reviews` : ""}`}
    >
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, value - index));
          return <Star key={index} fill={fill} half={fill > 0 && fill < 1} />;
        })}
      </div>
      <span
        className={cn(
          "tabular-nums",
          size === "sm" ? "text-[0.6875rem]" : "text-xs",
          tone === "inverted" ? "text-ink/70" : "text-ink/60",
        )}
      >
        {value.toFixed(1)}
        {reviewCount !== undefined && (
          <>
            <span aria-hidden="true"> · </span>
            <span className="sr-only">{reviewCount} reviews</span>
            <span aria-hidden="true">({reviewCount})</span>
          </>
        )}
      </span>
    </div>
  );
}
