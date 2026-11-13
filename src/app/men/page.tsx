import type { Metadata } from "next";
import { createCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = {
  title: "Men",
  description:
    "Shop AllPastels men — considered essentials in cotton, linen and merino, from oxford shirts to weekend layers.",
};

export default createCategoryPage("men");
