import HeroSection from "@/components/hero-section";
import LatestArticles from "@/components/latest-articles";
import PodcastSection from "@/components/podcast-section";
import PhotoGallery from "@/components/photo-gallery";
import NewsletterSignup from "@/components/newsletter-signup";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-[#D0A64B]" />
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      <main className="container mx-auto px-4 py-8 space-y-16">
        <Suspense fallback={<LoadingSpinner />}>
          <LatestArticles />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PodcastSection />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PhotoGallery />
        </Suspense>

        <section className="bg-muted py-16 -mx-4">
          <div className="container mx-auto">
            <NewsletterSignup />
          </div>
        </section>
      </main>
    </div>
  );
}