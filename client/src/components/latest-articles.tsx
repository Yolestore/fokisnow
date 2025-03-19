import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock } from "lucide-react";

export default function LatestArticles() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  if (isLoading) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-8">Dènye Atik Yo</h2>
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

  const categories = [...new Set(posts?.map(post => post.category) || [])];

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Dènye Atik Yo</h2>
        <div className="h-[2px] flex-1 mx-6 bg-[#D0A64B] opacity-20" />
      </div>

      {categories.map(category => (
        <div key={category} className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 capitalize">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.filter(post => post.category === category)
              .slice(0, 3)
              .map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {post.thumbnail && (
                      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 px-3 py-1 text-sm font-medium rounded-full bg-background/80 backdrop-blur-sm">
                          {post.type}
                        </div>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.views} vizit
                      </div>
                    </div>
                    <Link href={`/article/${post.id}`}>
                      <Button variant="secondary" className="w-full">
                        Li Plis
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}