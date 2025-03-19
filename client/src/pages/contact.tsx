
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Contact() {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Add contact form submission logic here
    setSending(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Kontakte Nou</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Enfòmasyon Kontak</h2>
          <div className="space-y-4">
            <p>Email: contact@fokisnow.com</p>
            <p>Telefòn: +509 0000-0000</p>
            <div className="flex gap-4 mt-6">
              <Button variant="outline">Facebook</Button>
              <Button variant="outline">Instagram</Button>
              <Button variant="outline">Twitter</Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input placeholder="Non ou" required />
          <Input type="email" placeholder="Imèl ou" required />
          <Input placeholder="Sijè" required />
          <Textarea placeholder="Mesaj ou" required className="h-32" />
          <Button type="submit" disabled={sending}>
            {sending ? "Ap voye..." : "Voye Mesaj"}
          </Button>
        </form>
      </div>
    </div>
  );
}
