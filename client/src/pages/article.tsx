import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@shared/schema";

export default function Article() {
  const { id } = useParams();
  
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['/api/posts', id],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!post) {
    return <div>Article not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          {post.thumbnail && (
            <img 
              src={post.thumbnail} 
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="prose dark:prose-invert max-w-none">
            {post.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
