import { useQuery } from "@tanstack/react-query";
import { Media } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PodcastSection() {
  const [playing, setPlaying] = useState<number | null>(null);
  
  const { data: podcasts, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    select: (data) => data.filter(m => m.type === 'podcast').slice(0, 3)
  });

  if (isLoading) {
    return (
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-8">FOKIS Podcast</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      <div className="flex items-center gap-3 mb-8">
        <svg className="h-8 w-8 text-[#D0A64B]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a11 11 0 0 0-11 11v6a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H4a9 9 0 0 1 8-5V1zm0 0a11 11 0 0 1 11 11v6a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h3a9 9 0 0 0-8-5V1z"/>
        </svg>
        <h2 className="text-3xl font-bold">FOKIS Podcast</h2>
      </div>

      <div className="space-y-4">
        {podcasts?.map((podcast) => (
          <Card key={podcast.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 shrink-0"
                  onClick={() => setPlaying(playing === podcast.id ? null : podcast.id)}
                >
                  {playing === podcast.id ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{podcast.description}</h3>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D0A64B] rounded-full"
                      style={{ width: playing === podcast.id ? '60%' : '0%' }}
                    />
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
