"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrder, lookupOrder } from "@/api";
import { OrderReceipt } from "@/components/orders/OrderReceipt";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { OrderDetail } from "@/types/order";

export function OrderSuccessClient({
  orderNumber,
  email,
}: {
  orderNumber: string;
  email?: string;
}) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = email
      ? await lookupOrder({ orderNumber, email })
      : await getOrder(orderNumber);
    if (result.ok) {
      setOrder(result.order);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [email, orderNumber]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  if (loading) {
    return (
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl" aria-busy="true">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-line" />
          <div className="mx-auto mt-7 h-8 w-64 animate-pulse rounded-sm bg-line" />
          <div className="mx-auto mt-4 h-4 w-80 animate-pulse rounded-sm bg-line" />
          <div className="mt-10 h-72 animate-pulse rounded-sm bg-line" />
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-lg text-center">
          <p className="ap-eyebrow text-burnt">Order confirmation</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)]">
            We could not load this order
          </h1>
          <p role="alert" className="ap-body mx-auto mt-4 max-w-md text-ink/65">
            {error ??
              "The order may still be processing. Please check your email or look it up with your order number."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/track-order" variant="primary" size="md" withArrow>
              Look up your order
            </Button>
            <Button href="/contact" variant="outline" size="md" withArrow>
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return <OrderReceipt order={order} celebrate lookupEmail={email} />;
}
