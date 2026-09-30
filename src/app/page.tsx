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
import { Testimonials } from "@/components/home/Testimonials";

/**
 * Homepage.
 *
 * The section order is the shopping journey, not a catalogue dump:
 * hook → orient (categories) → browse (new in) → desire (featured
 * collection) → intent (mood, occasion) → trust (editorial, bestsellers)
 * → convert (campaign, brand story, reviews, newsletter).
 *
 * Background tones alternate on purpose — Floral White and Ash-50 for
 * product density, Ash Grey / Burnt Peach / Cotton Rose for the editorial
 * beats — so the page has rhythm rather than one long undifferentiated
 * scroll.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <NewArrivals />
      <FeaturedCollection />
      <MoodSection />
      <EditorialSection />
      <Bestsellers />
      <DiscoverySection />
      <CampaignSection />
      <BrandStory />
      <Testimonials />
    </>
  );
}
