import type { Category, Discovery, Mood, NavLink } from "@/lib/types";

/** Primary navigation shown in the desktop navbar and mobile drawer. */
export const navLinks: NavLink[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/sale" },
];

/** Shop-by-category cards on the homepage. */
export const categories: Category[] = [
  {
    id: "women",
    title: "Women",
    description: "Fluid dresses, soft tailoring and layers built to move.",
    href: "/women",
    imageSlot: "categoryWomen",
    productCount: 8,
  },
  {
    id: "men",
    title: "Men",
    description: "Considered essentials in cotton, linen and merino.",
    href: "/men",
    imageSlot: "categoryMen",
    productCount: 6,
  },
  {
    id: "kids",
    title: "Kids",
    description: "Play-ready cotton and linen for the smallest people.",
    href: "/kids",
    imageSlot: "categoryKids",
    productCount: 6,
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "The finishing details — bags, silk, jewellery and shoes.",
    href: "/shop?category=accessories",
    imageSlot: "categoryAccessories",
    productCount: 8,
  },
];

/** Shop-by-mood discovery. */
export const moods: Mood[] = [
  {
    id: "everyday",
    title: "Everyday",
    description: "The pieces that carry you through a full day without thinking.",
    href: "/shop?mood=everyday",
    imageSlot: "moodEveryday",
  },
  {
    id: "weekend",
    title: "Weekend",
    description: "Unhurried layers for slow mornings and long afternoons.",
    href: "/shop?mood=weekend",
    imageSlot: "moodWeekend",
  },
  {
    id: "party",
    title: "Party",
    description: "Soft shine and clean lines for evenings worth dressing for.",
    href: "/shop?mood=party",
    imageSlot: "moodParty",
  },
  {
    id: "vacation",
    title: "Vacation",
    description: "Breathable linen and easy shapes that pack without creasing.",
    href: "/shop?mood=vacation",
    imageSlot: "moodVacation",
  },
  {
    id: "festive",
    title: "Festive",
    description: "Warm tones and considered detail for the season's gatherings.",
    href: "/shop?mood=festive",
    imageSlot: "moodFestive",
  },
];

/** Occasion-based discovery — the "what is this for?" entry point. */
export const discoveries: Discovery[] = [
  {
    id: "gifting",
    title: "Gifting",
    description: "Chosen with care, wrapped without extra charge.",
    href: "/collections?collection=gifting-edit",
    imageSlot: "discoveryGifting",
  },
  {
    id: "everyday",
    title: "Everyday",
    description: "The quiet workhorses of a well-dressed week.",
    href: "/shop?mood=everyday",
    imageSlot: "discoveryEveryday",
  },
  {
    id: "work",
    title: "Work",
    description: "Polished enough for the room, comfortable enough for the commute.",
    href: "/shop?mood=work",
    imageSlot: "discoveryWork",
  },
  {
    id: "travel",
    title: "Travel",
    description: "Packs light, wears well, arrives unwrinkled.",
    href: "/shop?mood=travel",
    imageSlot: "discoveryTravel",
  },
  {
    id: "celebration",
    title: "Celebrations",
    description: "For birthdays, weddings and everything worth marking.",
    href: "/shop?mood=party",
    imageSlot: "discoveryCelebration",
  },
];
