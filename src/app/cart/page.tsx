import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your AllPastels bag before checking out.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CartPage />;
}
