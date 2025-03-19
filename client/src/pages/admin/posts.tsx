import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Post } from "@shared/schema";
import { insertPostSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

type DialogMode = "create" | "edit";

const categories = [
  "personal-development",
  "country",
  "economy",
  "spirituality",
];

export default function AdminPosts() {
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      thumbnail: "",
      authorId: 1, // Default admin ID
      type: "article",
      seoTitle: "",
      seoDescription: "",
      keywords: [],
    },
  });

  const createPost = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Siksè",
        description: "Atik la kreye avèk siksè",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erè",
        description: error.message || "Gen yon erè ki fèt pandan kreyasyon atik la",
        variant: "destructive",
      });
    },
  });

  const updatePost = useMutation({
    mutationFn: (data: any) =>
      apiRequest("PATCH", `/api/posts/${selectedPost?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Siksè",
        description: "Atik la mizajou avèk siksè",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erè",
        description: error.message || "Gen yon erè ki fèt pandan mizajou atik la",
        variant: "destructive",
      });
    },
  });

  const deletePost = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Siksè",
        description: "Atik la efase avèk siksè",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erè",
        description: error.message || "Gen yon erè ki fèt pandan efase atik la",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: any) {
    if (dialogMode === "create") {
      createPost.mutate(values);
    } else {
      updatePost.mutate(values);
    }
  }

  function handleEdit(post: Post) {
    setDialogMode("edit");
    setSelectedPost(post);
    form.reset({
      title: post.title,
      content: post.content,
      category: post.category,
      thumbnail: post.thumbnail || "",
      authorId: post.authorId || 1,
      type: post.type,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      keywords: post.keywords || [],
    });
    setIsDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Atik yo</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setDialogMode("create");
                form.reset();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvo Atik
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Kreye Atik" : "Modifye Atik"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tit</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kontni</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chwazi yon kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imaj Thumbnail</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tit SEO</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsyon SEO</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {dialogMode === "create" ? "Kreye Atik" : "Mizajou Atik"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg"
          >
            <div>
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-muted-foreground">
                {post.category} • {post.views} vizit
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(post)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => deletePost.mutate(post.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}