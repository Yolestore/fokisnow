
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturedCategories() {
  const categories = [
    { title: "Politik", icon: "🏛️", count: 24 },
    { title: "Kilti", icon: "🎭", count: 18 },
    { title: "Edikasyon", icon: "📚", count: 15 },
    { title: "Ekonomi", icon: "💰", count: 12 }
  ];

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-8">Kategori Popilè</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card key={cat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold mb-1">{cat.title}</h3>
              <p className="text-sm text-muted-foreground">{cat.count} atik</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
