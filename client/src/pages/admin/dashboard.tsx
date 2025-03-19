
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { Loader2 } from "lucide-react";
import type { Post, Comment, Media } from "@shared/schema";

export default function AdminDashboard() {
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ['/api/comments'],
  });

  const { data: media = [], isLoading: mediaLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  if (postsLoading || commentsLoading || mediaLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  const stats = [
    { title: "Atik Aktif", value: posts.length },
    { title: "Kòmantè Anrejistre", value: comments.length },
    { title: "Medya Total", value: media.length }
  ];

  // Sample data for the chart - in production this would come from an API
  const visitData = [
    { date: "Lendi", visits: 150 },
    { date: "Madi", visits: 230 },
    { date: "Mèkredi", visits: 180 },
    { date: "Jedi", visits: 290 },
    { date: "Vandredi", visits: 340 },
    { date: "Samdi", visits: 270 },
    { date: "Dimanch", visits: 180 }
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">Tablo Administrasyon</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-xl">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vizit pa Jou</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#D0A64B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
