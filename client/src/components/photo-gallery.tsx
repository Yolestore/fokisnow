import { useQuery } from "@tanstack/react-query";
import { Media } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function PhotoGallery() {
  const { data: photos, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    select: (data) => data.filter(m => m.type === 'image').slice(0, 6)
  });

  if (isLoading) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-8">Photos that Speak</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Photos that Speak</h2>
        <Link href="/gallery" className="flex items-center text-[#D0A64B] hover:underline">
          See all photos 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos?.map((photo) => (
          <Card key={photo.id} className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={photo.url}
                  alt={photo.description || ''}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-4 text-white h-full flex flex-col justify-end">
                    <h3 className="text-[#D0A64B] font-semibold mb-2">
                      {photo.category}
                    </h3>
                    {photo.description && (
                      <p className="text-sm line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
