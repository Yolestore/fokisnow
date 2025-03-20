import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import type { Post } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminPosts() {
  const [, setLocation] = useLocation();

  const { data: posts } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const deletePost = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Siksè",
        description: "Atik la efase avèk siksè",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Atik yo</h1>
        <Button onClick={() => setLocation("/admin/posts/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Kreye Nouvo Atik
        </Button>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {post.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                    {post.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setLocation(`/admin/posts/${post.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Èske w sèten?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Aksyon sa pral efase atik sa nèt. Ou pa ka defè aksyon sa.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anile</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePost.mutate(post.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Efase
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}