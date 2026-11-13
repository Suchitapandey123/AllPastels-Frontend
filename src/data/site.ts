import type { NavLink } from "@/lib/types";

/** Site-wide constants. Single source of truth for copy and URLs. */

export const SITE = {
  name: "AllPastels",
  url: "http://allpastels.com",
  title: "AllPastels — Modern Style, Made for You",
  description:
    "Discover AllPastels — thoughtfully designed pieces for everyday style, occasions and everything in between.",
  tagline: "Everyday, elevated.",
} as const;

/** Rotating messages for the announcement bar. */
export const announcements: string[] = [
  "Complimentary shipping on orders over ₹2,999",
  "New season, new edit — explore the latest arrivals",
  "Easy 15-day returns on every order",
  "Gift wrapping included, always",
  "New here? Tap the gift for a welcome surprise",
];

/**
 * First-visit "surprise offer", surfaced by the <SurpriseOffer /> widget.
 * Kept here so the code, the value and the wording have a single source.
 */
export const SURPRISE_OFFER = {
  code: "PASTELS10",
  headline: "Unwrap 10% off your first order",
  description:
    "A little welcome gift from us. Reveal your code, then use it at checkout.",
  note: "One surprise per customer. Valid on full-price styles and not combinable with other offers.",
} as const;

/* -------------------------------------------------------------- Footer --- */

export const footerShopLinks: NavLink[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/sale" },
];

export const footerHelpLinks: NavLink[] = [
  { label: "Account", href: "/account" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping", href: "/faq#shipping" },
  { label: "Returns", href: "/faq#returns" },
  { label: "FAQs", href: "/faq" },
  { label: "Track Order", href: "/faq#tracking" },
];

export const footerAboutLinks: NavLink[] = [
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/about#journal" },
  { label: "Careers", href: "/about#careers" },
];

export const socialLinks: NavLink[] = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/faq#privacy" },
  { label: "Terms", href: "/faq#terms" },
  { label: "Shipping Policy", href: "/faq#shipping" },
];

/** Free-shipping threshold in paise-free rupees. */
export const FREE_SHIPPING_THRESHOLD = 2999;
