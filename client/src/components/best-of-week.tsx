import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function BestOfWeek() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    select: (data) => 
      [...data]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
  });

  if (isLoading) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-8">Most Popular This Week</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      <div className="flex items-center gap-3 mb-8">
        <Star className="h-8 w-8 text-[#D0A64B]" />
        <h2 className="text-3xl font-bold">Most Popular This Week</h2>
      </div>

      <div className="space-y-4">
        {posts?.map((post, index) => (
          <Link key={post.id} href={`/article/${post.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-bold text-[#D0A64B] opacity-50">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-2 line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{post.category}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D0A64B]" />
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
