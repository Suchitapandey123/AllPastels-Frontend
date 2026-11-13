import { Bestsellers } from "@/components/home/Bestsellers";
import { BrandStory } from "@/components/home/BrandStory";
import { CampaignSection } from "@/components/home/CampaignSection";
import { CategorySection } from "@/components/home/CategorySection";
import { DiscoverySection } from "@/components/home/DiscoverySection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Hero } from "@/components/home/Hero";
import { MoodSection } from "@/components/home/MoodSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { NewInCollage } from "@/components/home/NewInCollage";
import { ShopByBudget } from "@/components/home/ShopByBudget";
import { Testimonials } from "@/components/home/Testimonials";

/**
 * Homepage.
 *
 * A merchandising-led composition rather than a catalogue dump. The order is
 * the shopping journey, and it is deliberately careful about rhythm:
 *
 *   open (hero) → orient (categories) → browse products (new arrivals) →
 *   discover by moment (mood circles) → browse edits (collections) →
 *   shop by budget (gifting) → desire (featured collection) →
 *   social proof (bestsellers) → occasion (discovery mosaic) →
 *   brand voice (editorial, campaign, story) → trust (reviews).
 *
 * The one rule about rhythm: products never arrive twice in a row. The two
 * product grids (New arrivals, Bestsellers) are separated by circles, a
 * merchandising collage and an editorial split, so the page reads as a
 * designed sequence instead of a repeated grid.
 *
 * Background tones alternate on purpose — Floral White and Surface for
 * product density, Ash Grey / Burnt Peach for the editorial beats, and a
 * soft pastel aura behind the hero — so the scroll has cadence.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <NewArrivals />
      <MoodSection />
      <NewInCollage />
      <ShopByBudget />
      <FeaturedCollection />
      <Bestsellers />
      <DiscoverySection />
      <EditorialSection />
      <CampaignSection />
      <BrandStory />
      <Testimonials />
    </>
  );
}
