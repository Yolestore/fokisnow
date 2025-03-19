import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestArticles() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  if (isLoading) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Latest Articles</h2>
        <div className="h-[2px] flex-1 mx-6 bg-[#D0A64B] opacity-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.slice(0, 6).map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {post.thumbnail && (
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-3 py-1 text-sm font-medium rounded-full bg-[#D0A64B] text-white">
                    {post.category}
                  </div>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {post.title}
              </h3>
              <Link href={`/article/${post.id}`}>
                <Button variant="secondary" className="w-full">
                  Start Discussion
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
