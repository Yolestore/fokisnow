
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import type { Category } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminCategories() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button>Add Category</Button>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <Input defaultValue={category.name} className="max-w-xs" />
              </div>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => deleteCategory.mutate(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
