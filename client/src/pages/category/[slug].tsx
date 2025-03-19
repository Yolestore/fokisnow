
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", slug],
    queryFn: () => fetch(`/api/posts?category=${slug}`).then(r => r.json())
  });

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{slug}</h1>
      
      <div className="flex gap-4 mb-8">
        <Input placeholder="Rechercher..." className="max-w-xs" />
        <Select>
          <option value="recent">Plus récent</option>
          <option value="popular">Plus populaire</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover rounded-lg" />
              <h2 className="text-xl font-bold mt-4">{post.title}</h2>
              <p className="text-muted-foreground mt-2">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
