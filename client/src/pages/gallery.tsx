import { useQuery } from "@tanstack/react-query";
import { Media } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Gallery() {
  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  const images = media?.filter(m => m.type === 'image') || [];
  const videos = media?.filter(m => m.type === 'video') || [];
  const podcasts = media?.filter(m => m.type === 'podcast') || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Media Gallery</h1>
      
      <Tabs defaultValue="images">
        <TabsList className="w-full justify-start mb-8">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <img
                    src={item.url}
                    alt={item.description || ''}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="aspect-video">
                    <iframe
                      src={item.url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="podcasts">
          <div className="space-y-4">
            {podcasts.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <audio controls className="w-full">
                    <source src={item.url} type="audio/mpeg" />
                  </audio>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
