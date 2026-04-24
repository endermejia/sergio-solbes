import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Landmark, Coins, ScrollText, Ship, Factory } from "lucide-react"
import { lineasInvestigacion } from "@/lib/data"

const iconMap: Record<string, React.ElementType> = {
  Building: Landmark,
  Map: Coins,
  Leaf: ScrollText,
  Shield: Ship,
  Ship: Factory,
}

const researchAreas = [
  {
    icon: Coins,
    title: "Finanzas Públicas del Siglo XVIII",
    description: "Estudio de los sistemas fiscales, la formación del Estado moderno y el papel de las instituciones públicas y agentes privados en la gestión de la Hacienda durante el reinado de los Borbones."
  },
  {
    icon: Landmark,
    title: "Historia Fiscal de Canarias",
    description: "Análisis del régimen fiscal diferenciado de las Islas Canarias, los privilegios territoriales y su evolución durante el Antiguo Régimen y la época contemporánea."
  },
  {
    icon: ScrollText,
    title: "El Estanco del Tabaco",
    description: "Investigación sobre el monopolio del tabaco en España, su administración territorial, consumos y valores de la renta en diferentes regiones como Navarra, Valencia y Canarias."
  },
  {
    icon: Ship,
    title: "Provisión Militar y Estado Contratista",
    description: "Estudio de los mecanismos de provisión del ejército español (vestuario, suministros) y el papel de los asentistas y contratistas privados en la gestión militar del siglo XVIII."
  },
  {
    icon: Factory,
    title: "Comercio Atlántico",
    description: "Análisis de la navegación directa de Canarias a América, el sistema comercial atlántico y las reformas borbónicas en el comercio colonial."
  },
]

export function ResearchSection() {
  return (
    <section id="investigacion" className="py-20 md:py-28 bg-secondary/30 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Líneas de Investigación
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mi trabajo se orienta hacia la <strong className="text-foreground">Historia de España 
            en el siglo XVIII</strong>, especialmente el mundo de las finanzas y la formación del Estado moderno.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchAreas.map((area) => (
            <Card key={area.title} className="border-border/50 bg-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <area.icon className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{area.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
