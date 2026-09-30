"use client";

import Image from "next/image";
import { useState } from "react";
import { productImages } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { ProductImageSet } from "@/lib/images";

/**
 * ProductGallery — the main image plus its thumbnails.
 *
 * On mobile the images stack into a swipeable rail rather than showing a
 * thumbnail strip, which keeps the tap target large and lets a shopper
 * flick through the detail shots the way they would on a native app.
 */

interface ProductGalleryProps {
  photoSet: ProductImageSet;
  productName: string;
}

export function ProductGallery({ photoSet, productName }: ProductGalleryProps) {
  const images = productImages(photoSet, { width: 1200, aspect: "portrait" });
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">
      {/* Thumbnails — desktop only */}
      {images.length > 1 && (
        <ul className="order-1 hidden shrink-0 flex-col gap-3 lg:flex">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1} of ${productName}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative block h-24 w-[4.5rem] overflow-hidden border bg-ash-50 transition-colors",
                  index === active ? "border-ink" : "border-transparent hover:border-line",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Main image — desktop */}
      <div className="relative order-2 hidden aspect-[3/4] w-full overflow-hidden bg-ash-50 lg:block">
        <Image
          key={active}
          src={images[active]}
          alt={
            active === 0
              ? `${productName} — front view`
              : `${productName} — detail view ${active}`
          }
          fill
          // The first product image is the page's LCP element.
          preload={active === 0}
          sizes="(max-width: 1024px) 50vw, 45vw"
          className="object-cover"
        />
      </div>

      {/* Image rail — mobile & tablet */}
      <ul className="order-1 flex snap-x snap-mandatory gap-3 overflow-x-auto sm:order-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((src, index) => (
          <li
            key={src}
            className="relative aspect-[3/4] w-[76vw] shrink-0 snap-center overflow-hidden bg-ash-50 sm:w-[45vw]"
          >
            <Image
              src={src}
              alt={
                index === 0 ? `${productName} — front view` : `${productName} — detail ${index}`
              }
              fill
              sizes="(max-width: 640px) 76vw, 45vw"
              preload={index === 0}
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
