import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSection() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const featuredPost = posts?.length ? posts[0] : null;

  if (isLoading) {
    return (
      <Card className="my-8">
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!featuredPost) {
    return null;
  }

  return (
    <section className="relative my-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {featuredPost.thumbnail && (
            <div className="relative h-[400px] lg:h-[500px]">
              <img
                src={featuredPost.thumbnail}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="inline-block px-4 py-1 mb-4 text-sm font-semibold rounded-full bg-[#D0A64B]">
                  {featuredPost.category}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  {featuredPost.title}
                </h1>
                <Link href={`/article/${featuredPost.id}`}>
                  <Button 
                    variant="secondary" 
                    className="group"
                  >
                    Li Plis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}