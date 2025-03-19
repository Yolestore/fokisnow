import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Image,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminLayout from "@/components/layouts/admin-layout";
import type { Post, Comment, Media } from "@shared/schema";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['/api/comments'],
  });

  const { data: media } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  const totalViews = posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const pendingComments = comments?.filter(c => !c.approved).length || 0;

  const stats = [
    {
      title: "Total Posts",
      value: posts?.length || 0,
      icon: FileText,
      description: "Articles and videos published",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: TrendingUp,
      description: "Combined article views",
    },
    {
      title: "Media Items",
      value: media?.length || 0,
      icon: Image,
      description: "Photos and podcasts",
    },
    {
      title: "Pending Comments",
      value: pendingComments,
      icon: MessageSquare,
      description: "Comments awaiting approval",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts?.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.views} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments?.slice(0, 5).map((comment) => (
                <div key={comment.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.approved ? "Approved" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
