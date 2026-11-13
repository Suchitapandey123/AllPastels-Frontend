import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Newsletter } from "@/components/home/Newsletter";
import { ArrowRightIcon, LeafIcon, ReturnIcon, TruckIcon } from "@/components/ui/icons";
import {
  footerAboutLinks,
  footerHelpLinks,
  footerShopLinks,
  legalLinks,
  socialLinks,
} from "@/data/site";

/**
 * Footer — the closing band of every page.
 *
 * Structure: newsletter → service promises → link columns → legal row.
 * Newsletter sits above the links because it is the single most valuable
 * action on the page, and visitors reach it before scrolling to the bottom.
 */

const promises = [
  {
    icon: TruckIcon,
    title: "Free shipping",
    detail: "On all orders over ₹2,999",
  },
  {
    icon: ReturnIcon,
    title: "Easy returns",
    detail: "15 days, no questions asked",
  },
  {
    icon: LeafIcon,
    title: "Natural fabrics",
    detail: "Linen, cotton and merino first",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    { title: "Shop", links: footerShopLinks },
    { title: "Help", links: footerHelpLinks },
    { title: "About", links: footerAboutLinks },
  ];

  return (
    <footer className="border-t border-line bg-floral">
      <Newsletter />

      {/* Service promises */}
      <Container>
        <ul className="grid grid-cols-1 gap-8 border-b border-line py-10 sm:grid-cols-3 sm:gap-6 sm:py-12">
          {promises.map((promise) => (
            <li key={promise.title} className="flex items-start gap-4">
              <promise.icon className="mt-0.5 h-6 w-6 shrink-0 text-burnt" />
              <div>
                <p className="ap-eyebrow text-ink">{promise.title}</p>
                <p className="ap-body mt-1 text-sm text-ink/60">{promise.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Link columns */}
      <Container>
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-4 lg:gap-8 lg:py-16">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-baseline" aria-label="AllPastels — home">
              <span className="font-display text-2xl leading-none tracking-[0.16em] text-ink">
                ALL
              </span>
              <span className="font-display text-2xl leading-none tracking-[0.16em] text-burnt">
                PASTELS
              </span>
            </Link>
            <p className="ap-body mt-5 max-w-xs text-sm text-ink/60">
              Considered pieces for everyday style, made in small runs from natural
              fabrics — and built to be worn often.
            </p>

            <div className="mt-6">
              <p className="ap-eyebrow mb-3 text-ink/40">Follow</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ap-eyebrow text-ink/70 transition-colors hover:text-burnt"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="ap-eyebrow mb-5 text-ink">{column.title}</h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-ink/65 transition-colors hover:text-burnt"
                    >
                      {link.label}
                      <ArrowRightIcon className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      {/* Legal row */}
      <div className="border-t border-line">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="ap-eyebrow text-ink/45">
              © {year} AllPastels · All rights reserved
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="ap-eyebrow text-ink/45 transition-colors hover:text-burnt"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
