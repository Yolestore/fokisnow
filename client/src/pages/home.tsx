import HeroSection from "@/components/hero-section";
import LatestArticles from "@/components/latest-articles";
import PodcastSection from "@/components/podcast-section";
import PhotoGallery from "@/components/photo-gallery";
import MembershipCTA from "@/components/membership-cta";
import BestOfWeek from "@/components/best-of-week";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <LatestArticles />
      <PodcastSection />
      <PhotoGallery />
      <MembershipCTA />
      <BestOfWeek />
    </div>
  );
}
