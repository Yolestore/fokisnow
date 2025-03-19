
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Nou Se FOKIS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Misyon Nou</h2>
            <p className="text-muted-foreground">
              FOKIS se yon platfòm medya ki konsantre sou pataje enfòmasyon, 
              analiz ak refleksyon sou aktyalite sosyal, politik ak kiltirèl an Ayiti.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Vizyon Nou</h2>
            <p className="text-muted-foreground">
              Nou vle kreye yon espas dyalòg ki pèmèt Ayisyen konprann ak 
              diskite sou pwoblèm sosyete nou an, pou nou ka jwenn solisyon ansanm.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-3xl font-bold mb-6">Istwa Nou</h2>
        <p className="mb-4">
          FOKIS te kòmanse an 2024 ak yon vizyon klè: kreye yon platfòm 
          medya ki bay enfòmasyon kredib ak analiz apwofondi sou aktyalite Ayiti.
        </p>
        <p className="mb-4">
          Jounen jodi a, nou kontinye grandi ak yon kominote ki angaje nan 
          pataje konesans ak diskisyon ki konstwiktif.
        </p>
      </div>
    </div>
  );
}
