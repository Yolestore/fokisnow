
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FeaturedCategories() {
  const categories = [
    { title: "Politik", icon: "🏛️", count: 24 },
    { title: "Kilti", icon: "🎭", count: 18 },
    { title: "Edikasyon", icon: "📚", count: 15 },
    { title: "Ekonomi", icon: "💰", count: 12 }
  ];

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-medium mb-8 text-center">Kategori</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Card 
              key={cat.title} 
              className="border-none shadow-none hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                <span className="text-3xl">{cat.icon}</span>
                <div className="text-center">
                  <h3 className="font-medium text-sm">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count} atik</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
