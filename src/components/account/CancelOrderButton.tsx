"use client";

import { useState } from "react";
import { PdpModal } from "@/components/product/PdpModal";
import { Button } from "@/components/ui/Button";
import { cancelOrder, isOrderCancellable } from "@/api";
import type { OrderDetail } from "@/types/order";

/**
 * CancelOrderButton — the customer-initiated cancellation control.
 *
 * The backend allows customers to cancel orders until they are shipped; the
 * button is therefore rendered only for those orders, and the request is
 * guarded again before it is sent. Cancellation restores stock but does not
 * touch the cart, so no cart refresh is needed.
 */
export function CancelOrderButton({
  order,
  onCancelled,
}: {
  order: OrderDetail;
  /** Receives the backend's updated order so the history can refresh. */
  onCancelled?: (order: OrderDetail) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cancellable = isOrderCancellable(order);

  const openDialog = () => {
    setError(null);
    setSuccess(false);
    setOpen(true);
  };

  const closeDialog = () => {
    if (pending) return;
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (pending || success) return;

    if (!isOrderCancellable(order)) {
      setError("This order can no longer be cancelled.");
      return;
    }

    setPending(true);
    setError(null);

    const result = await cancelOrder(order.id);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    onCancelled?.(result.order);
  };

  return (
    <>
      {cancellable && (
        <button
          type="button"
          onClick={openDialog}
          className="ap-eyebrow text-ink/50 transition-colors duration-300 hover:text-burnt"
        >
          Cancel order
        </button>
      )}

      <PdpModal
        open={open}
        onClose={closeDialog}
        labelledBy={`cancel-order-${order.id}-title`}
        eyebrow="Cancel order"
        title={success ? "Order cancelled" : "Cancel this order?"}
      >
        {success ? (
          <div aria-live="polite">
            <p className="ap-body text-sm text-ink/70">
              Order <span className="text-ink">{order.id}</span> has been
              cancelled. Any reserved stock has been returned to the boutique.
            </p>
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeDialog}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="ap-body text-sm text-ink/70">
              Order <span className="text-ink">{order.id}</span> will be
              cancelled and this cannot be undone. If you need a different
              arrangement, contact the boutique instead.
            </p>

            {error && (
              <p role="alert" className="ap-body mt-4 text-sm text-burnt">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeDialog}
                disabled={pending}
              >
                Keep order
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => void handleConfirm()}
                disabled={pending}
                aria-busy={pending}
              >
                {pending ? "Cancelling…" : "Yes, cancel order"}
              </Button>
            </div>
          </div>
        )}
      </PdpModal>
    </>
  );
}
