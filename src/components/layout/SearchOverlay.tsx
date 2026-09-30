"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { CloseIcon, HeartIcon, SearchIcon } from "@/components/ui/icons";
import { products } from "@/data/products";
import { productImage } from "@/lib/images";
import { formatPrice } from "@/lib/utils";

/**
 * SearchOverlay — a full-width search panel with live suggestions.
 *
 * Suggestions are computed from the in-memory catalogue with a simple
 * substring match. With a real backend this becomes a debounced fetch; the
 * interaction model stays identical.
 */

const MAX_SUGGESTIONS = 5;

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { wishlist } = useStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Defer so the panel is mounted before focus moves into it.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const term = query.trim().toLowerCase();
  const matches = term
    ? products
        .filter((product) =>
          `${product.name} ${product.categoryLabel} ${product.category}`
            .toLowerCase()
            .includes(term),
        )
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const savedItems = products.filter((product) => wishlist.includes(product.id)).slice(0, 3);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = query.trim();
    if (!search) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-ash-800/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close search"
        tabIndex={-1}
      />

      <div className="ap-anim-rise relative max-h-[85vh] overflow-y-auto bg-floral-400 shadow-2xl">
        <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-10">
          <div className="mb-6 flex items-center justify-between">
            <p className="ap-eyebrow text-burnt">Search AllPatels</p>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-70"
              aria-label="Close search"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} role="search" className="relative">
            <label htmlFor="ap-search" className="sr-only">
              Search for products
            </label>
            <input
              id="ap-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What are you looking for?"
              autoComplete="off"
              className="w-full border-b border-ink/20 bg-transparent pb-4 pr-12 font-display text-2xl text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-burnt sm:text-3xl"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink transition-colors hover:text-burnt"
              aria-label="Submit search"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
          </form>

          {matches.length > 0 && (
            <div className="mt-8">
              <p className="ap-eyebrow mb-4 text-ink/40">Products</p>
              <ul className="flex flex-col divide-y divide-line">
                {matches.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/products/${product.slug}`);
                        onClose();
                      }}
                      className="flex w-full items-center gap-4 py-3.5 text-left"
                    >
                      <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-ash-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImage(product.photoSet, 0, { width: 120 })}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{product.name}</span>
                        <span className="ap-eyebrow text-ink/45">{product.categoryLabel}</span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-ink/70">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {term && matches.length === 0 && (
            <p className="ap-body mt-8 text-ink/60">
              No pieces match “{query.trim()}”. Try a category like linen, knit or dress.
            </p>
          )}

          {!term && savedItems.length > 0 && (
            <div className="mt-8">
              <p className="ap-eyebrow mb-4 flex items-center gap-2 text-ink/40">
                <HeartIcon className="h-3.5 w-3.5" filled />
                Saved items
              </p>
              <ul className="flex flex-wrap gap-3">
                {savedItems.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/products/${product.slug}`);
                        onClose();
                      }}
                      className="flex items-center gap-3 border border-line bg-floral-50 px-3 py-2 text-left transition-colors hover:border-burnt"
                    >
                      <span className="relative h-12 w-9 shrink-0 overflow-hidden bg-ash-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImage(product.photoSet, 0, { width: 90 })}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span className="text-xs text-ink">{product.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
