import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Custom 404.
 *
 * A dead end with a route out: search, the four main categories, and a link
 * home. Styled with the same editorial treatment as the rest of the site.
 */
export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center py-24 text-center sm:py-32">
        <p className="ap-eyebrow mb-5 text-burnt">Error 404</p>

        <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.95]">
          This page has
          <br />
          <span className="italic text-burnt">moved on.</span>
        </h1>

        <p className="ap-body mx-auto mt-6 max-w-md text-ink/70">
          The link you followed does not exist any more. Try searching for what you
          were after, or start from one of these.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/shop" variant="primary" size="md" withArrow>
            Shop everything
          </Button>
          <Button href="/" variant="outline" size="md" withArrow>
            Back to home
          </Button>
        </div>

        <nav aria-label="Popular categories" className="mt-14 w-full border-t border-line pt-10">
          <p className="ap-eyebrow mb-6 text-ink/40">Popular places</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { label: "New Arrivals", href: "/new-arrivals" },
              { label: "Women", href: "/women" },
              { label: "Men", href: "/men" },
              { label: "Kids", href: "/kids" },
              { label: "Collections", href: "/collections" },
              { label: "Sale", href: "/sale" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Button href={link.href} variant="ghost" size="sm">
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  );
}
