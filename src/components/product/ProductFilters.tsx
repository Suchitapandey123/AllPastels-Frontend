"use client";

import { useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { categories, moods } from "@/data/categories";
import { collections } from "@/data/collections";
import { PRICE_BOUNDS, PRICE_STEPS } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { useProductFilters } from "@/components/product/useProductFilters";

/**
 * ProductFilters — faceted filter panel.
 *
 * Renders as a persistent sidebar on desktop and a bottom sheet on mobile,
 * from one shared body so the two can never drift out of sync.
 */

interface ProductFiltersProps {
  className?: string;
  resultCount?: number;
}

export function ProductFilters({ className, resultCount }: ProductFiltersProps) {
  const {
    activeCategories,
    activeMoods,
    activeCollections,
    minPrice,
    maxPrice,
    activeCount,
    toggleParam,
    setSingle,
    clearAll,
  } = useProductFilters();

  const [open, setOpen] = useState(false);

  const filters = (
    <div className="flex flex-col gap-8">
      <FilterGroup title="Category">
        <ul className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <li key={category.id}>
              <CheckFilter
                checked={activeCategories.includes(category.id)}
                onChange={() => toggleParam("category", category.id)}
                label={category.title}
                count={category.productCount}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Shop by mood">
        <ul className="flex flex-wrap gap-2">
          {moods.map((mood) => {
            const active = activeMoods.includes(mood.id);
            return (
              <li key={mood.id}>
                <ChipToggle
                  active={active}
                  onClick={() => toggleParam("mood", mood.id)}
                  label={mood.title}
                />
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Collection">
        <ul className="flex flex-col gap-2.5">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <CheckFilter
                checked={activeCollections.includes(collection.slug)}
                onChange={() => toggleParam("collection", collection.slug)}
                label={collection.title}
                count={collection.productSlugs.length}
              />
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price">
        <ul className="flex flex-wrap gap-2">
          {PRICE_STEPS.map((step) => (
            <li key={step}>
              <ChipToggle
                active={minPrice === String(step)}
                onClick={() => setSingle("min", minPrice === String(step) ? null : String(step))}
                label={`Under ${formatPrice(step)}`}
              />
            </li>
          ))}
          {maxPrice && (
            <li>
              <button
                type="button"
                onClick={() => setSingle("max", null)}
                className="ap-eyebrow flex items-center gap-1.5 border border-ash-800 bg-ash-800 px-3.5 py-2 text-floral-50"
              >
                Up to {formatPrice(Number(maxPrice))}
                <CloseIcon className="h-3 w-3" />
              </button>
            </li>
          )}
        </ul>
        <p className="ap-body mt-3 text-xs text-ink/45">
          Prices range from {formatPrice(PRICE_BOUNDS.min)} to {formatPrice(PRICE_BOUNDS.max)}.
        </p>
      </FilterGroup>
    </div>
  );

  return (
    <div className={className}>
      {/* Desktop — persistent sidebar */}
      <div className="hidden lg:block">
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <h2 className="ap-eyebrow text-ink">Filter</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="ap-eyebrow text-burnt transition-opacity hover:opacity-70"
            >
              Clear ({activeCount})
            </button>
          )}
        </div>
        {filters}
      </div>


      {/* Mobile — trigger that opens a bottom sheet */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ap-eyebrow flex items-center gap-2 text-ink"
            aria-expanded={open}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              className="h-4 w-4"
            >
              <path d="M3 5h14M6 10h8M8 15h4" />
            </svg>
            Filter{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>

          {activeCount > 0 && (
            <button type="button" onClick={clearAll} className="ap-eyebrow text-burnt">
              Clear all
            </button>
          )}
        </div>

        {open && (
          <div
            className="fixed inset-0 z-[65]"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <button
              type="button"
              className="absolute inset-0 h-full w-full bg-ash-800/50"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              tabIndex={-1}
            />
            <div className="ap-anim-rise absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-floral-400">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-floral-400 px-5 py-4">
                <h2 className="ap-eyebrow text-ink">Filter</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
                  aria-label="Close filters"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="px-5 py-6">{filters}</div>

              <div className="sticky bottom-0 border-t border-line bg-floral-400 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ap-eyebrow w-full bg-ash-800 py-4 text-floral-50 transition-colors hover:bg-burnt"
                >
                  Show {resultCount !== undefined ? resultCount : "results"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="ap-eyebrow mb-4 text-ink/45">{title}</h3>
      {children}
    </div>
  );
}

/** Pill-style toggle used for mood and price facets. */
function ChipToggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "ap-eyebrow border border-ash-800 bg-ash-800 px-3.5 py-2 text-floral-50 transition-colors"
          : "ap-eyebrow border border-line px-3.5 py-2 text-ink/70 transition-colors hover:border-ink"
      }
    >
      {label}
    </button>
  );
}

function CheckFilter({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className="group flex w-full items-center gap-3 text-left"
    >
      <span
        aria-hidden="true"
        className={
          checked
            ? "flex h-4 w-4 shrink-0 items-center justify-center border border-ash-800 bg-ash-800 text-floral-50"
            : "flex h-4 w-4 shrink-0 items-center justify-center border border-line transition-colors group-hover:border-ink"
        }
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-3 w-3"
          >
            <path d="M2 6.2l2.6 2.6L10 3.2" />
          </svg>
        )}
      </span>
      <span
        className={
          checked
            ? "flex-1 text-sm text-ink transition-colors"
            : "flex-1 text-sm text-ink/65 transition-colors group-hover:text-ink"
        }
      >
        {label}
      </span>
      {count !== undefined && <span className="ap-eyebrow text-ink/35">{count}</span>}
    </button>
  );
}
