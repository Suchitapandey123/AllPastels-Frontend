import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AccountPanel } from "@/components/account/AccountPanel";
import { CancelOrderButton } from "@/components/account/CancelOrderButton";
import { Button } from "@/components/ui/Button";
import { BagIcon } from "@/components/ui/icons";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { productImage } from "@/lib/images";
import { cn, formatPrice, pluralize } from "@/lib/utils";

/**
 * Order history — the record panel.
 *
 * Orders are cards rather than a table: on a fashion storefront the
 * photographs are the fastest way to recognise a purchase, so each line
 * leads with its thumbnail and the totals sit in a quiet footer rule.
 */

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  placed: { label: "Pending", className: "bg-cotton-800 text-cotton-100" },
  confirmed: { label: "Confirmed", className: "bg-cotton-800 text-cotton-100" },
  processing: { label: "Packing", className: "bg-cotton-800 text-cotton-100" },
  shipped: { label: "In transit", className: "bg-floral-400 text-floral-100" },
  delivered: { label: "Delivered", className: "bg-ash-900 text-ash-200" },
  cancelled: { label: "Cancelled", className: "bg-burnt-900 text-burnt-200" },
  payment_failed: {
    label: "Payment failed",
    className: "bg-burnt-900 text-burnt-200",
  },
  refunded: { label: "Refunded", className: "bg-ash-900 text-ash-200" },
};

/** Status pill — one shape, one dot, three token-based tints. */
export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "ap-eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function formatOrderDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The product lines of an order. `skipFirstRule` drops the first divider
 * when the card header already draws one, so the two never stack.
 */
export function OrderLines({
  order,
  skipFirstRule = false,
}: {
  order: OrderDetail;
  skipFirstRule?: boolean;
}) {
  return (
    <ul>
      {order.lines.map((line) => (
        <li
          key={`${order.id}-${line.productId}-${line.size}`}
          className={cn(
            "flex items-center gap-4 border-t border-line px-5 py-4",
            skipFirstRule && "first:border-t-0",
          )}
        >
          <Link
            href={`/products/${line.product.slug}`}
            className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-floral"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={productImage(line.product.photoSet, 0, { width: 160 })}
              alt=""
              fill
              sizes="72px"
              className="object-cover"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">
              <Link
                href={`/products/${line.product.slug}`}
                className="transition-colors duration-300 hover:text-burnt"
              >
                {line.product.name}
              </Link>
            </p>
            <p className="ap-body mt-1 text-xs text-ink/50">
              {line.size ? `Size ${line.size} · ` : ""}Qty {line.quantity}
            </p>
          </div>

          <p className="shrink-0 text-sm tabular-nums text-ink">
            {formatPrice(line.lineTotal)}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Totals plus the follow-up links, shared by every order card. */
export function OrderFooter({
  order,
  action,
}: {
  order: OrderDetail;
  /** Optional order-specific action, e.g. cancellation on the history list. */
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="ap-eyebrow text-ink/50">
        {pluralize(order.itemCount, "item")} · {formatPrice(order.total)}
      </p>
      <div className="flex items-center gap-5">
        {action}
        <Link
          href={`/orders/${order.id}`}
          className="ap-eyebrow text-burnt transition-colors duration-300 hover:text-burnt-400"
        >
          View order
        </Link>
        <Link
          href="/contact"
          className="ap-eyebrow text-ink/50 transition-colors duration-300 hover:text-burnt"
        >
          Need help?
        </Link>
      </div>
    </div>
  );
}

/** One order, framed. The left edge carries the status at a glance. */
export function OrderCard({
  order,
  label,
  action,
  className,
}: {
  order: OrderDetail;
  /** Small header label — "Latest order" on the overview, none on the list. */
  label?: string;
  /** Optional footer action rendered before the follow-up links. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "border border-line border-l-2 bg-surface/50 transition-colors duration-300",
        ["delivered", "cancelled", "payment_failed", "refunded"].includes(
          order.status,
        )
          ? "border-l-ash-400"
          : "border-l-burnt",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-line px-5 py-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {label && <p className="ap-eyebrow text-ink/45">{label}</p>}
          {!label && <span className="ap-eyebrow text-ink">{order.id}</span>}
          <OrderStatusPill status={order.status} />
        </div>
        <p className="ap-eyebrow text-ink/45">
          {label ? `${order.id} · Placed ` : "Placed "}
          {formatOrderDate(order.placedOn)}
        </p>
      </div>

      <OrderLines order={order} skipFirstRule={Boolean(label)} />

      <div className="border-t border-line bg-floral px-5 py-4">
        <OrderFooter order={order} action={action} />
      </div>
    </article>
  );
}

export function AccountOrders({
  orders,
  loading = false,
  error = null,
  onRetry,
  onOrderCancelled,
}: {
  orders: OrderDetail[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  /** Called with the backend's updated order after a successful cancellation. */
  onOrderCancelled?: (order: OrderDetail) => void;
}) {
  return (
    <AccountPanel
      id="account-orders"
      eyebrow="Orders"
      title="Order history"
      meta={loading ? "Loading…" : pluralize(orders.length, "order")}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
          <p className="ap-eyebrow text-ink/40">Loading your orders…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-burnt/40 bg-burnt-900/30 px-6 py-16 text-center">
          <p role="alert" className="ap-body max-w-sm text-sm text-burnt-200">
            {error}
          </p>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" withArrow onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
          <BagIcon className="h-9 w-9 text-burnt" />
          <p className="ap-body max-w-sm text-sm text-ink/60">
            Nothing here yet — your first order will appear with its tracking
            details as soon as it is placed.
          </p>
          <Button href="/shop" variant="outline" size="sm" withArrow>
            Start shopping
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                action={
                  <CancelOrderButton
                    order={order}
                    onCancelled={onOrderCancelled}
                  />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </AccountPanel>
  );
}
