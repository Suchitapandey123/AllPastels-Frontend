"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { productImages } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { ProductImageSet } from "@/lib/images";

/**
 * ProductGallery — the main image stage plus its navigation.
 *
 * Desktop (lg+): a vertical thumbnail rail beside a 3:4 stage. Every
 * photograph of the set is stacked in the stage and crossfades between
 * selections; hovering zooms into the photograph at the cursor's position.
 * Prev/next buttons step through the set and the stage is focusable and
 * arrow-key driven.
 *
 * Mobile & tablet: a full-width swipeable rail with snap points. Pagination
 * is a row of index bars — the active bar widens — which are also buttons,
 * so the gallery can be driven by tap as well as swipe.
 */

interface ProductGalleryProps {
  photoSet: ProductImageSet;
  imageUrls?: string[];
  productName: string;
  /** Backend alt text; without it a descriptive fallback is generated. */
  imageAlt?: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

export function ProductGallery({
  photoSet,
  imageUrls,
  productName,
  imageAlt,
}: ProductGalleryProps) {
  const images =
    imageUrls && imageUrls.length
      ? imageUrls
      : productImages(photoSet, { width: 1200, aspect: "portrait" });
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const railRef = useRef<HTMLUListElement | null>(null);

  const count = images.length;
  const showNav = count > 1;

  const altFor = useCallback(
    (index: number) => {
      const base = imageAlt || productName;
      return index === 0 ? `${base} — front view` : `${base} — detail view ${index}`;
    },
    [imageAlt, productName],
  );

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      setActive(next);
      // Keep the mobile rail on the same slide as the desktop stage.
      railRef.current?.scrollTo({
        left: next * railRef.current.clientWidth,
        behavior: "smooth",
      });
    },
    [count],
  );

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    }
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  // Mobile rail: the slide nearest the left edge becomes the active image.
  function syncActiveFromRail() {
    const rail = railRef.current;
    if (!rail || rail.clientWidth === 0) return;
    const index = Math.round(rail.scrollLeft / rail.clientWidth);
    if (index >= 0 && index < count && index !== active) setActive(index);
  }

  function scrollToSlide(index: number) {
    setActive(index);
    railRef.current?.scrollTo({
      left: index * railRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div data-qa="gallery" className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Thumbnails — desktop only */}
      {showNav && (
        <ul
          className="hidden shrink-0 flex-col gap-3 lg:flex"
          aria-label="Product image thumbnails"
        >
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => scrollToSlide(index)}
                aria-label={`View image ${index + 1} of ${count}: ${
                  index === 0 ? "front view" : `detail view ${index}`
                }`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative block aspect-[3/4] w-[4.5rem] overflow-hidden rounded-sm border border-transparent bg-surface transition-all duration-300",
                  index === active
                    ? "border-ink opacity-100"
                    : "opacity-55 hover:border-line hover:opacity-100",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="72px"
                  loading="lazy"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Stage — desktop */}
      <div
        data-qa="stage"
        className="group/main relative hidden aspect-[3/4] w-full cursor-zoom-in self-start overflow-hidden rounded-sm bg-surface lg:block"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`${productName} image gallery. Use arrow keys to browse ${count} image${count === 1 ? "" : "s"}.`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={index === active ? altFor(index) : ""}
            fill
            // The first product image is the page's LCP element.
            preload={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            style={{
              opacity: index === active ? 1 : 0,
              zIndex: index === active ? 1 : 0,
              pointerEvents: index === active ? undefined : "none",
              transform: zoomed && index === active ? "scale(1.7)" : undefined,
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transition:
                "opacity 550ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        ))}

        {/* Index */}
        {showNav && (
          <p className="ap-eyebrow absolute bottom-4 right-4 z-10 rounded-full bg-floral/90 px-3 py-1 text-[10px] tabular-nums text-ink/70">
            {pad(active + 1)} / {pad(count)}
          </p>
        )}

        {/* Prev / next */}
        {showNav && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-floral/95 text-ink opacity-0 transition-all duration-300 ease-editorial hover:bg-floral focus-visible:opacity-100 group-hover/main:translate-x-0 group-hover/main:opacity-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-floral/95 text-ink opacity-0 transition-all duration-300 ease-editorial hover:bg-floral focus-visible:opacity-100 group-hover/main:translate-x-0 group-hover/main:opacity-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Stage — mobile & tablet: swipeable rail */}
      <div className="w-full lg:hidden">
        <ul
          ref={railRef}
          onScroll={syncActiveFromRail}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="ap-scroll-x flex w-full snap-x snap-mandatory overflow-x-auto"
          aria-label={`${productName} images`}
        >
          {images.map((src, index) => (
            <li
              key={src}
              className="relative aspect-[3/4] w-full shrink-0 snap-center overflow-hidden rounded-sm bg-surface"
            >
              <Image
                src={src}
                alt={altFor(index)}
                fill
                sizes="100vw"
                preload={index === 0}
                className="object-cover"
              />
            </li>
          ))}
        </ul>

        {/* Pagination — index bars, also tappable */}
        {showNav && (
          <div className="mt-4 flex justify-center gap-1.5">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => scrollToSlide(index)}
                aria-label={`Go to image ${index + 1} of ${count}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "h-[3px] transition-all duration-500 ease-editorial",
                  index === active ? "w-9 bg-ink" : "w-6 bg-ink/15 hover:bg-ink/30",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
