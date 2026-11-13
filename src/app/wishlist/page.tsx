import type { Metadata } from "next";
import { WishlistPage } from "@/components/wishlist/WishlistPage";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The AllPastels pieces you have saved for later.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <WishlistPage />;
}
