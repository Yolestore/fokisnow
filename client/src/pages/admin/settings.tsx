
import AdminLayout from "@/components/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Title</Label>
              <Input defaultValue="FOKIS Now" />
            </div>
            <div className="space-y-2">
              <Label>Site Description</Label>
              <Textarea defaultValue="Fòk Se Kounya - Share knowledge and experiences" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input type="url" placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input type="url" placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input type="url" placeholder="https://instagram.com/..." />
            </div>
            <Button>Save Links</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
