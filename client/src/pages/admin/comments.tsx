import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import type { Comment } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminComments() {
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['/api/comments'],
  });

  const approveComment = useMutation({
    mutationFn: (id: number) =>
      apiRequest("PATCH", `/api/comments/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      toast({
        title: "Success",
        description: "Comment approved successfully",
      });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/comments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comment Moderation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start justify-between p-4 bg-card rounded-lg border"
            >
              <div className="space-y-1">
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-muted-foreground">
                  Post ID: {comment.postId} • User ID: {comment.userId}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      comment.approved
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {comment.approved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!comment.approved && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => approveComment.mutate(comment.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteComment.mutate(comment.id)}
                  className="text-destructive"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {!comments?.length && (
            <p className="text-center text-muted-foreground py-8">
              No comments to moderate.
            </p>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
