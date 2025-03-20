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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import MediaViewer from "@/components/media-viewer";
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
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

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
        title: "Siksè",
        description: "Medya anrejistre avèk siksè",
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
        title: "Siksè",
        description: "Medya efase avèk siksè",
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
              Ajoute Medya
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajoute Medya</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <SelectValue placeholder="Chwazi tip medya" />
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
                        <Input {...field} placeholder="Antre URL medya a" />
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
                      <FormLabel>Deskripsyon</FormLabel>
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
                <Button type="submit" className="w-full">
                  Ajoute
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedMedia && (
            <MediaViewer
              type={selectedMedia.type as "image" | "video"}
              url={selectedMedia.url}
              mediaId={selectedMedia.id}
              onNext={() => {
                const currentIndex = media?.findIndex(m => m.id === selectedMedia.id) ?? -1;
                if (currentIndex < (media?.length ?? 0) - 1) {
                  setSelectedMedia(media?.[currentIndex + 1] ?? null);
                }
              }}
              onPrevious={() => {
                const currentIndex = media?.findIndex(m => m.id === selectedMedia.id) ?? -1;
                if (currentIndex > 0) {
                  setSelectedMedia(media?.[currentIndex - 1] ?? null);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Imaj</TabsTrigger>
          <TabsTrigger value="videos">Videyo</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.url}
                  alt={item.description || ""}
                  className="w-full aspect-square object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Èske w sèten?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Aksyon sa pral efase medya sa nèt. Ou pa ka defè aksyon sa.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anile</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMedia.mutate(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Efase
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((item) => (
              <div
                key={item.id}
                className="relative aspect-video bg-card rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.url.split('v=')[1]}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Èske w sèten?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Aksyon sa pral efase medya sa nèt. Ou pa ka defè aksyon sa.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anile</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMedia.mutate(item.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Efase
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Èske w sèten?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Aksyon sa pral efase medya sa nèt. Ou pa ka defè aksyon sa.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anile</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMedia.mutate(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Efase
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}