import type { Collection, Testimonial } from "@/lib/types";

/**
 * Curated collections shown on /collections and used to group the homepage
 * editorial features.
 */
export const collections: Collection[] = [
  {
    slug: "the-new-edit",
    title: "The New Edit",
    tagline: "Soft silhouettes. Warm tones. Effortless details.",
    description:
      "This season's most considered pieces in one place — washed linens, matte satins and brushed cotton in the shades we return to every year.",
    href: "/collections/the-new-edit",
    imageSlot: "collectionSoftStructure",
    productSlugs: [
      "sandstone-linen-wrap-dress",
      "marigold-cotton-overshirt",
      "floral-white-silk-blouse",
      "cotton-rose-slip-skirt",
      "cotton-rose-silk-scarf",
    ],
  },
  {
    slug: "soft-structure",
    title: "Soft Structure",
    tagline: "Tailoring that refuses to feel stiff.",
    description:
      "Sharp lines softened by fabric choices you can live in all day. Wool blends, fine merino and clean-cut tailoring that holds its shape.",
    href: "/collections/soft-structure",
    imageSlot: "collectionTailored",
    productSlugs: [
      "ash-grey-merino-crew",
      "dark-ash-wide-leg-trouser",
      "clay-leather-tote",
      "minimal-leather-watch",
      "ash-grey-merino-crew-neck-mens",
    ],
  },
  {
    slug: "warm-weather",
    title: "Warm Weather",
    tagline: "Linen, canvas and long evenings outside.",
    description:
      "Breathable naturals for the months that ask you to slow down — packed light, worn often, and better for every wash.",
    href: "/collections/warm-weather",
    imageSlot: "collectionSunlit",
    productSlugs: [
      "ash-linen-summer-shirt",
      "ash-canvas-weekender",
      "round-aviator-sunglasses",
      "burnt-peach-twill-overshirt",
      "little-linen-shorts",
    ],
  },
  {
    slug: "after-dark",
    title: "After Dark",
    tagline: "A little shine, held back on purpose.",
    description:
      "Evening pieces in matte satin and brushed cotton rather than gloss — considered enough for a dinner, quiet enough for the walk home.",
    href: "/collections/after-dark",
    imageSlot: "collectionSoftStructure",
    productSlugs: [
      "powder-blush-satin-slip-dress",
      "burnt-peach-knit-cardigan",
      "minimal-gold-hoops",
      "evening-slingback-heels",
    ],
  },
  {
    slug: "little-things",
    title: "Little Things",
    tagline: "Small sizes, same standards.",
    description:
      "Our kids' edit uses the same natural fabrics and considered fits as the rest of the range — built for play, washed without regret.",
    href: "/collections/little-things",
    imageSlot: "collectionSunlit",
    productSlugs: [
      "tiny-bloom-cotton-dress",
      "soft-cotton-tee-pair",
      "ash-jogger-set",
      "powder-blush-party-dress",
      "minimal-gold-hoops",
    ],
  },
  {
    slug: "everyday-layers",
    title: "Everyday Layers",
    tagline: "The pieces that do most of the work.",
    description:
      "Shirts, tees and overshirts in dense cotton that layer cleanly and keep their shape through the season.",
    href: "/collections/everyday-layers",
    imageSlot: "collectionTailored",
    productSlugs: [
      "marigold-cotton-overshirt",
      "floral-white-oxford-shirt",
      "cotton-rose-jersey-tee",
      "everyday-canvas-sneakers",
    ],
  },
  {
    slug: "gifting-edit",
    title: "The Gifting Edit",
    tagline: "For the people who are hard to shop for.",
    description:
      "A tight edit of things people rarely buy for themselves — chosen to arrive ready to give, with gift wrapping included.",
    href: "/collections/gifting-edit",
    imageSlot: "collectionGifting",
    productSlugs: [
      "cotton-rose-silk-scarf",
      "minimal-gold-hoops",
      "clay-leather-tote",
      "ash-canvas-weekender",
    ],
  },
];

/** Customer reviews for the homepage and product pages. */
export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    quote:
      "The linen wrap dress is the first thing I have bought that looks better after washing. I wear it three times a week and it still feels like the day I unboxed it.",
    author: "Ananya Rao",
    location: "Bengaluru",
    rating: 5,
    productSlug: "sandstone-linen-wrap-dress",
  },
  {
    id: "t-02",
    quote:
      "Ordered the merino crew expecting a standard winter jumper. The weight is perfect for our office — warm in the morning, not too hot by afternoon.",
    author: "Rohan Mehta",
    location: "Pune",
    rating: 5,
    productSlug: "ash-grey-merino-crew",
  },
  {
    id: "t-03",
    quote:
      "The little cotton dress survived a monsoon outing, two machine washes and an enthusiastic amount of mud. It still looks new. That never happens.",
    author: "Meera Iyer",
    location: "Chennai",
    rating: 5,
    productSlug: "tiny-bloom-cotton-dress",
  },
  {
    id: "t-04",
    quote:
      "Packaging arrived in paper, not plastic, and the scarf was folded by hand. Small thing, but it told me what kind of company this was before I unwrapped it.",
    author: "Farhan Qureshi",
    location: "Hyderabad",
    rating: 4,
    productSlug: "cotton-rose-silk-scarf",
  },
  {
    id: "t-05",
    quote:
      "Bought the leather tote for a work trip and ended up carrying it every day since. The unlined interior is far more practical than I expected.",
    author: "Divya Nair",
    location: "Kochi",
    rating: 5,
    productSlug: "clay-leather-tote",
  },
  {
    id: "t-06",
    quote:
      "Sizing advice in the product page was genuinely useful — I am between two sizes and the measurements told me exactly which way to go. No returns needed.",
    author: "Arjun Desai",
    location: "Ahmedabad",
    rating: 5,
    productSlug: "dark-ash-wide-leg-trouser",
  },
];
