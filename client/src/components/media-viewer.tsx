import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Heart, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MediaViewerProps {
  type: "image" | "video";
  url: string;
  mediaId: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function MediaViewer({ type, url, mediaId, onNext, onPrevious }: MediaViewerProps) {
  const [comment, setComment] = useState("");

  const { data: likes } = useQuery({
    queryKey: [`/api/media/${mediaId}/likes`],
  });

  const { data: comments } = useQuery({
    queryKey: [`/api/media/${mediaId}/comments`],
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/media/${mediaId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/media/${mediaId}/likes`] });
      toast({
        title: "Siksè",
        description: "Ou fèk bay yon like",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => apiRequest("POST", `/api/media/${mediaId}/comments`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/media/${mediaId}/comments`] });
      setComment("");
      toast({
        title: "Siksè",
        description: "Kòmantè ou a anrejistre",
      });
    },
  });

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Navigation buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
          {onPrevious && (
            <Button variant="outline" size="icon" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
          {onNext && (
            <Button variant="outline" size="icon" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Media content */}
        {type === "image" ? (
          <img 
            src={url} 
            alt="" 
            className="w-full aspect-video object-cover rounded-lg"
          />
        ) : (
          <div className="relative pt-[56.25%]">
            <iframe
              src={getYouTubeEmbedUrl(url)}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
        >
          <Heart className="h-4 w-4 mr-2" />
          {likes?.count || 0} Like
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          {comments?.length || 0} Kòmantè
        </Button>
      </div>

      {/* Comments section */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ekri yon kòmantè..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button 
            onClick={() => commentMutation.mutate(comment)}
            disabled={commentMutation.isPending || !comment.trim()}
          >
            Voye
          </Button>
        </div>

        <div className="space-y-2">
          {comments?.map((comment: any) => (
            <div key={comment.id} className="p-3 bg-card rounded-lg">
              <p className="font-medium text-sm">{comment.user.username}</p>
              <p className="text-muted-foreground">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
