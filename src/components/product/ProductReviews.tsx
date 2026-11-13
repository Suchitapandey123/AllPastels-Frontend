"use client";

import { useEffect, useState } from "react";
import { PdpModal } from "@/components/product/PdpModal";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { CheckIcon, StarIcon } from "@/components/ui/icons";
import {
  getReviews,
  submitReview,
  type NewReviewInput,
  type Review,
  type ReviewsPayload,
} from "@/lib/pdp-data";
import { pluralize } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * ProductReviews — the trust section beneath the product details.
 *
 * ── FRONTEND ONLY ──
 * Reviews come from the mock `getReviews()`. A submitted review is rendered
 * optimistically in component state and is explicitly NOT persisted — it
 * disappears on reload, and the UI says so rather than pretending otherwise.
 * When the backend lands, `getReviews`/`submitReview` become real calls and
 * this state becomes server state; no layout changes.
 *
 * Readable statically: the summary block renders immediately from
 * `product.rating` / `product.reviewCount`, which already ship with the
 * product, and only the review cards wait on the mock promise.
 */
export function ProductReviews({ product }: { product: Product }) {
  const [payload, setPayload] = useState<ReviewsPayload | null>(null);
  const [pending, setPending] = useState<Review[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void getReviews(product).then((data) => {
      if (active) setPayload(data);
    });
    return () => {
      active = false;
    };
  }, [product]);

  // Reviews just written sit above the mock ones for this session only.
  const reviews = [...pending, ...(payload?.reviews ?? [])];

  const handleSubmit = async (input: NewReviewInput) => {
    const created = await submitReview(product, input);
    setPending((current) => [created, ...current]);
  };

  const recommended = Math.round((payload?.breakdown[0].percent ?? 76) * 0.9);

  return (
    <section className="border-t border-line" id="reviews">
      <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <Summary
          product={product}
          breakdown={payload?.breakdown ?? []}
          recommended={recommended}
          onWrite={() => setFormOpen(true)}
        />
        <ReviewList
          reviews={reviews}
          loading={!payload}
          hasPending={pending.length > 0}
          onWrite={() => setFormOpen(true)}
        />
      </div>

      <WriteReviewForm
        product={product}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

/* ========================================================================== *
 * Summary — score, stars, count and distribution
 * ========================================================================== */

function Summary({
  product,
  breakdown,
  recommended,
  onWrite,
}: {
  product: Product;
  breakdown: { stars: number; percent: number }[];
  recommended: number;
  onWrite: () => void;
}) {
  const hasReviews = product.reviewCount > 0;

  return (
    <div className="lg:col-span-4">
      <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt-300">
        <span aria-hidden="true" className="h-px w-8 bg-burnt-400/50" />
        Customer reviews
      </p>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl text-ink">{product.rating.toFixed(1)}</span>
        <span className="text-sm text-ink/65">out of 5</span>
      </div>

      <Rating value={product.rating} size="md" className="mt-3" />

      <p className="ap-body mt-3 text-sm text-ink/70">
        {hasReviews ? `Based on ${pluralize(product.reviewCount, "review")}` : "No reviews yet"}
      </p>

      {hasReviews && breakdown.length > 0 && (
        <div className="mt-7 flex flex-col gap-2.5">
          {breakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="ap-eyebrow w-8 shrink-0 tabular-nums text-ink/65">
                {row.stars} ★
              </span>
              <span
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`${row.percent}% of reviews are ${row.stars} star`}
              >
                <span
                  className="block h-full rounded-full bg-burnt-400"
                  style={{ width: `${row.percent}%` }}
                />
              </span>
              <span className="ap-eyebrow w-10 shrink-0 text-right tabular-nums text-ink/55">
                {row.percent}%
              </span>
            </div>
          ))}
        </div>
      )}

      {hasReviews && (
        <p className="ap-body mt-6 text-sm text-ink/70">
          <span className="font-medium text-ink">{recommended}%</span> of shoppers would
          recommend this piece.
        </p>
      )}

      {hasReviews && (
        <Button onClick={onWrite} variant="outline" size="md" className="mt-6 w-full sm:w-auto">
          Write a review
        </Button>
      )}
    </div>
  );
}
/* ========================================================================== *
 * Review cards
 * ========================================================================== */

function ReviewList({
  reviews,
  loading,
  hasPending,
  onWrite,
}: {
  reviews: Review[];
  loading: boolean;
  hasPending: boolean;
  onWrite: () => void;
}) {
  if (loading) {
    // Matches the card rhythm so the column doesn't jump when data arrives.
    return (
      <div className="lg:col-span-7 lg:col-start-6" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div key={index} className="border-t border-line py-7 first:border-t-0 first:pt-0">
            <div className="h-3 w-32 bg-surface" />
            <div className="mt-4 h-3 w-full bg-surface" />
            <div className="mt-2 h-3 w-4/5 bg-surface" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="lg:col-span-7 lg:col-start-6">
        <div className="flex h-full flex-col justify-center border border-line bg-surface px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex items-center gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((star) => (
              <StarIcon key={star} filled={false} className="h-4 w-4 text-ink/20" />
            ))}
          </div>
          <h3 className="ap-balance mt-5 font-display text-2xl leading-snug text-ink">
            No reviews yet
          </h3>
          <p className="ap-body mt-3 max-w-sm text-ink/70">
            Be the first to share how this piece fits and wears. Your words help the next
            shopper choose with confidence.
          </p>
          <Button onClick={onWrite} variant="outline" size="md" className="mt-7 w-full sm:w-auto">
            Write the first review
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 lg:col-start-6">
      <ul className="flex flex-col">
        {reviews.map((review) => (
          <li key={review.id} className="border-t border-line py-7 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <Rating value={review.rating} />
              <time dateTime={review.date} className="ap-eyebrow tabular-nums text-ink/65">
                {new Date(review.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>

            <h3 className="ap-balance mt-4 font-display text-xl leading-snug text-ink">
              {review.title}
            </h3>
            <p className="ap-body mt-2.5 text-ink/75">{review.body}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink/60">
              <span className="font-medium text-ink">
                {review.author}
                {review.location !== "Your review" && `, ${review.location}`}
              </span>
              {review.sizePurchased && (
                <span className="ap-eyebrow text-ink/60">Size {review.sizePurchased}</span>
              )}
              {review.verifiedPurchase && (
                <span className="flex items-center gap-1.5 text-burnt-300">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Verified purchase
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {hasPending && (
        <p
          role="status"
          className="ap-body mt-6 border-l-2 border-burnt-400 bg-surface px-4 py-3 text-sm text-ink/70"
        >
          Your review is shown above. This is a preview only — it hasn&apos;t been
          submitted or saved.
        </p>
      )}
    </div>
  );
}
/* ========================================================================== *
 * Write-a-review form — frontend only, nothing is persisted
 * ========================================================================== */

const EMPTY: NewReviewInput = {
  author: "",
  rating: 5,
  title: "",
  body: "",
  sizePurchased: "",
};

function WriteReviewForm({
  product,
  open,
  onClose,
  onSubmit,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewReviewInput) => Promise<void>;
}) {
  const [values, setValues] = useState<NewReviewInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof NewReviewInput, string>>>({});

  const update = (name: keyof NewReviewInput, value: string | number) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found: Partial<Record<keyof NewReviewInput, string>> = {};
    if (!values.author.trim()) found.author = "Please add your name";
    if (values.title.trim().length < 3) found.title = "Give your review a short title";
    if (values.body.trim().length < 10) found.body = "Tell us a little more (10+ characters)";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    await onSubmit(values);
    // Reset with a sensible default size for the next review.
    setValues({ ...EMPTY, sizePurchased: product.sizes[0] ?? "" });
    onClose();
  };

  // Shared input styling keeps the three text fields visually identical.
  const field = (name: keyof NewReviewInput) =>
    `w-full border bg-floral-900 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none ${
      errors[name] ? "border-burnt" : "border-line focus:border-ink"
}`;
  const label = "ap-body mb-2 block text-sm text-ink";

  return (
    <PdpModal
      open={open}
      onClose={onClose}
      labelledBy="ap-write-review-title"
      eyebrow={product.name}
      title="Write a review"
    >
      <p className="ap-body text-ink/65">
        Share how it fits and how it wears. This is a demonstration storefront, so your
        review appears on this page only — it isn&apos;t submitted or saved anywhere.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7">
        <fieldset>
          <legend className={label}>Your rating</legend>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => update("rating", star)}
                aria-pressed={values.rating === star}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                className="flex h-11 w-11 items-center justify-center transition-transform hover:scale-110"
              >
                <StarIcon
                  filled={star <= values.rating}
                  className={`h-6 w-6 ${star <= values.rating ? "text-burnt" : "text-ink/15"}`}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="ap-review-author" className={label}>
            Name
          </label>
          <input
            id="ap-review-author"
            value={values.author}
            onChange={(event) => update("author", event.target.value)}
            aria-invalid={errors.author ? true : undefined}
            className={field("author")}
            placeholder="Your name"
          />
          {errors.author && (
            <p role="alert" className="ap-body mt-2 text-xs text-burnt">
              {errors.author}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="ap-review-title" className={label}>
            Review title
          </label>
          <input
            id="ap-review-title"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={errors.title ? true : undefined}
            className={field("title")}
            placeholder="Sums up your experience"
          />
          {errors.title && (
            <p role="alert" className="ap-body mt-2 text-xs text-burnt">
              {errors.title}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="ap-review-size" className={label}>
            Size you purchased
          </label>
          <select
            id="ap-review-size"
            value={values.sizePurchased}
            onChange={(event) => update("sizePurchased", event.target.value)}
            className="w-full border border-line bg-floral-900 px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label htmlFor="ap-review-body" className={label}>
            Your review
          </label>
          <textarea
            id="ap-review-body"
            rows={4}
            value={values.body}
            onChange={(event) => update("body", event.target.value)}
            aria-invalid={errors.body ? true : undefined}
            className={`${field("body")} resize-y`}
            placeholder="How does it fit? How is the fabric?"
          />
          {errors.body && (
            <p role="alert" className="ap-body mt-2 text-xs text-burnt">
              {errors.body}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onClose} variant="ghost" size="md">
            Cancel
          </Button>
          <button
            type="submit"
            className="ap-eyebrow bg-ink px-8 py-4 text-floral-900 transition-colors duration-500 hover:bg-burnt"
          >
            Post review
          </button>
        </div>
      </form>
    </PdpModal>
  );
}
