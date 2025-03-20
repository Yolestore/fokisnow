import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import type { Post } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/layouts/admin-layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2 } from "lucide-react";

const categories = [
  "devlopman-personel",
  "peyi",
  "ekonomi",
  "espirityalite",
  "teknoloji",
  "kilti",
  "edikasyon",
  "espò"
];

const types = ["article", "video", "podcast"];

export default function PostEditor() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id?: string }>();
  
  const { data: post, isLoading: isLoadingPost } = useQuery<Post>({
    queryKey: [`/api/posts/${id}`],
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      type: "article",
      thumbnail: "",
      published: true,
    },
  });

  useEffect(() => {
    if (post) {
      form.reset(post);
    }
  }, [post, form]);

  const createPost = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Siksè",
        description: "Atik la kreye avèk siksè",
      });
      setLocation("/admin/posts");
    },
  });

  const updatePost = useMutation({
    mutationFn: (data: any) =>
      apiRequest("PATCH", `/api/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts', `/api/posts/${id}`] });
      toast({
        title: "Siksè",
        description: "Atik la modifye avèk siksè",
      });
      setLocation("/admin/posts");
    },
  });

  const deletePost = useMutation({
    mutationFn: () =>
      apiRequest("DELETE", `/api/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Siksè",
        description: "Atik la efase avèk siksè",
      });
      setLocation("/admin/posts");
    },
  });

  function onSubmit(values: any) {
    if (id) {
      updatePost.mutate(values);
    } else {
      createPost.mutate(values);
    }
  }

  if (isLoadingPost) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {id ? "Modifye Atik" : "Kreye Atik"}
        </h1>
        {id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Efase
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
                  onClick={() => deletePost.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Efase
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
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
                      <Textarea className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tip</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chwazi yon tip" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imaj (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {createPost.isPending || updatePost.isPending ? 
                    "Ap anrejistre..." : 
                    id ? "Mete ajou" : "Kreye"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
