import type { Metadata } from "next";
import { createCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = {
  title: "Kids",
  description:
    "Shop AllPatels kids — play-ready cotton, linen and organic jersey for babies, toddlers and older children.",
};

export default createCategoryPage("kids");
