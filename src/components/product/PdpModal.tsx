"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";

/**
 * PdpModal — the shared overlay shell for the product page dialogs.
 *
 * Extracted because the size guide and the write-a-review form need identical
 * behaviour, and duplicating focus management in two places is how overlays
 * drift apart. It deliberately mirrors the conventions already used by
 * `CartDrawer` and `SearchOverlay`:
 *
 * - `role="dialog"` + `aria-modal` + a labelled heading
 * - Escape closes, the scrim closes, focus moves in on open and returns to
 *   the trigger on close
 * - body scroll is locked while open
 * - Tab is trapped inside the panel
 * - a centred panel on desktop, a bottom sheet on phones
 */
export function PdpModal({
  open,
  onClose,
  labelledBy,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the element that names this dialog. */
  labelledBy: string;
  title: string;
  /** Small label above the title. */
  eyebrow?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      // Focus trap: cycle within the panel so the page behind is unreachable.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Defer so the panel is mounted before focus moves into it.
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-ash-100/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
        tabIndex={-1}
      />

      <div className="flex min-h-full items-end justify-center sm:items-center sm:p-6">
        <div
          ref={panelRef}
          className="ap-anim-rise relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-floral shadow-2xl sm:max-h-[85vh]"
        >
          {/* Header — sticky so the close control is always reachable */}
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-8">
            <div>
              {eyebrow && <p className="ap-eyebrow mb-2 text-burnt">{eyebrow}</p>}
              <h2 id={labelledBy} className="text-xl sm:text-2xl">
                {title}
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center text-ink transition-opacity hover:opacity-70"
              aria-label="Close dialog"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
