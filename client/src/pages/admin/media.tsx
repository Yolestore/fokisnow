import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/layouts/admin-layout";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import type { Media } from "@shared/schema";
import { insertMediaSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

const mediaTypes = ["image", "video", "podcast"];
const categories = [
  "personal-development",
  "country",
  "economy",
  "spirituality",
];

export default function AdminMedia() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: media } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  const form = useForm({
    resolver: zodResolver(insertMediaSchema),
    defaultValues: {
      url: "",
      type: "",
      description: "",
      category: "",
    },
  });

  const createMedia = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/media", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const deleteMedia = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Success",
        description: "Media deleted successfully",
      });
    },
  });

  function onSubmit(values: any) {
    createMedia.mutate(values);
  }

  const images = media?.filter((m) => m.type === "image") || [];
  const videos = media?.filter((m) => m.type === "video") || [];
  const podcasts = media?.filter((m) => m.type === "podcast") || [];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Media</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mediaTypes.map((type) => (
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
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter media URL" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
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
                <Button type="submit" className="w-full">
                  Upload
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.url}
                  alt={item.description || ""}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteMedia.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="space-y-4">
            {videos.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">{item.url}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMedia.mutate(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="podcasts" className="mt-6">
          <div className="space-y-4">
            {podcasts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-card rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.description}</p>
                  <audio controls className="mt-2">
                    <source src={item.url} type="audio/mpeg" />
                  </audio>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMedia.mutate(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
