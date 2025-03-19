import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MembershipCTA() {
  return (
    <section className="my-12">
      <Card className="bg-[#D0A64B] text-white">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Become a FOKIS Member
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join our community of forward-thinking individuals who are passionate about 
              personal development, social analysis, and positive change.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-[#D0A64B] hover:bg-white/90"
            >
              Register Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
