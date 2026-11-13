import type { Metadata } from "next";
import { createCategoryPage } from "@/lib/category-page";

export const metadata: Metadata = {
  title: "Women",
  description:
    "Shop AllPastels women — fluid dresses, soft tailoring, knitwear and layers in linen, cotton, silk and merino.",
};

export default createCategoryPage("women");
