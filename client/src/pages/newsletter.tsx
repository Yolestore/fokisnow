
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Siksè!",
          description: "Ou enskri nan newsletter nou an.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Erè",
        description: "Gen yon pwoblèm. Tanpri eseye ankò.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Newsletter FOKIS</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Enskri pou w resevwa dènye nouvèl ak analiz nou yo dirèkteman nan bwat 
          imèl ou.
        </p>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Antre imèl ou"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Enskri
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
