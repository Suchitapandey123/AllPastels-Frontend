import { cn } from "@/lib/utils";
import { STRENGTH_LABELS, passwordStrength } from "@/lib/auth";

/**
 * StrengthMeter — four pastel segments that fill as the password hardens.
 *
 * Pure display: it recomputes the score from the live value, so there is no
 * state to keep in sync with the field beside it.
 */

const FILL_BY_SCORE = [
  "bg-line",
  "bg-burnt",
  "bg-floral-300",
  "bg-ash-400",
  "bg-ash-300",
] as const;

export function StrengthMeter({ value }: { value: string }) {
  const score = passwordStrength(value);
  const filled = FILL_BY_SCORE[score];

  return (
    <div aria-hidden="true" className="mt-3">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "h-[3px] flex-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              index < score ? cn(filled, "shadow-sm") : "bg-line",
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "ap-body mt-2 text-xs transition-colors duration-300",
          value.length === 0 ? "text-ink/40" : score <= 1 ? "text-burnt-400" : "text-ash-200",
        )}
      >
        {value.length === 0
          ? "At least 8 characters, with a capital and a number."
          : STRENGTH_LABELS[score]}
      </p>
    </div>
  );
}
