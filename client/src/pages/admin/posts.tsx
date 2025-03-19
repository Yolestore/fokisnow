import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import type { Post } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminPosts() {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const deletePost = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => deletePost.mutate(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}