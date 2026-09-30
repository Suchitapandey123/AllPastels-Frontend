import { cn } from "@/lib/utils";

/**
 * SectionHeading — the repeated header shape used by every homepage band.
 *
 * Centralising it is what keeps fourteen different sections feeling like one
 * designed page: same eyebrow treatment, same type scale, same rhythm.
 */

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Overrides for use on dark or brand-coloured panels. */
  tone?: "default" | "inverted";
  className?: string;
  /** Rendered on the right — usually a "View all" link. */
  action?: React.ReactNode;
  /** Heading level; keeps the document outline correct per page. */
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  className,
  action,
  as: Heading = "h2",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6",
        isCentered ? "items-center text-center" : "items-start",
        Boolean(action) && "sm:flex-row sm:items-end sm:justify-between sm:gap-10",
        className,
      )}
    >
      <div className={cn("max-w-2xl", isCentered && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "ap-eyebrow mb-4 flex items-center gap-3",
              isCentered && "justify-center",
              tone === "inverted" ? "text-ash-800/70" : "text-burnt",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-px w-8",
                tone === "inverted" ? "bg-ash-800/40" : "bg-burnt/50",
              )}
            />
            {eyebrow}
          </p>
        )}

        <Heading
          className={cn(
            "text-[clamp(2rem,4.5vw,3.5rem)]",
            tone === "inverted" ? "text-ash-800" : "text-ink",
          )}
        >
          {title}
        </Heading>

        {description && (
          <p
            className={cn(
              "ap-body mt-5 max-w-xl",
              isCentered && "mx-auto",
              tone === "inverted" ? "text-ash-800/75" : "text-ink/70",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
