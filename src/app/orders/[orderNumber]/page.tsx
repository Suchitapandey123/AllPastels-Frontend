import type { Metadata } from "next";
import { OrderDetailsClient } from "@/components/orders/OrderDetailsClient";

export const metadata: Metadata = {
  title: "Order details",
  description: "Track and review your AllPastels order.",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string | string[] }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { orderNumber } = await params;
  const query = await searchParams;
  const email = Array.isArray(query.email) ? query.email[0] : query.email;
  return <OrderDetailsClient orderNumber={orderNumber} email={email} />;
}
