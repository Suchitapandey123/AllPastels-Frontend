import type { Metadata } from "next";
import { TrackOrderClient } from "@/components/orders/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track your order",
  description:
    "Look up an AllPastels order with your order number and checkout email.",
};

export default function Page() {
  return <TrackOrderClient />;
}
