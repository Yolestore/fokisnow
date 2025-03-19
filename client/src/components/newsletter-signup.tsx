
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewsletterSignup() {
  return (
    <section className="my-12">
      <Card className="bg-[#1E1E1E] text-white">
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Rete Konekte</h2>
            <p className="mb-6">Enskri pou resevwa dènye nouvèl ak analiz nou yo dirèkteman nan imèl ou.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Adrès imèl ou" className="bg-white/10" />
              <Button className="bg-[#D0A64B] hover:bg-[#B88F3D]">Enskri</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
