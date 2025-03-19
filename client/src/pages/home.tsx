import HeroSection from "@/components/hero-section";
import LatestArticles from "@/components/latest-articles";
import PodcastSection from "@/components/podcast-section";
import PhotoGallery from "@/components/photo-gallery";
import MembershipCTA from "@/components/membership-cta";
import BestOfWeek from "@/components/best-of-week";
import FeaturedCategories from "@/components/featured-categories";
import NewsletterSignup from "@/components/newsletter-signup";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <FeaturedCategories />
      <LatestArticles />
      <NewsletterSignup />
      <PodcastSection />
      <PhotoGallery />
      <MembershipCTA />
      <BestOfWeek />
    </div>
  );
}
