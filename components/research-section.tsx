import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Landmark, Coins, ScrollText, Ship, Factory } from "lucide-react"

const researchAreas = [
  {
    icon: Coins,
    title: "Sistema Financiero de las Islas Canarias",
    description: "Análisis del sistema fiscal y financiero canario durante el siglo XVIII, incluyendo el estudio del reino de Navarra como marco comparativo."
  },
  {
    icon: ScrollText,
    title: "La Renta del Tabaco",
    description: "Investigación sobre esta figura fiscal fundamental para entender la hacienda borbónica y su papel en la financiación del Estado."
  },
  {
    icon: Landmark,
    title: "Tesorería General",
    description: "Estudio de las instituciones financieras centrales y su evolución durante las reformas administrativas del siglo XVIII."
  },
  {
    icon: Ship,
    title: "Provisión Militar y Vestuario",
    description: "Análisis de los efectos económicos de la provisión militar, con especial atención al apartado del vestuario del ejército."
  },
  {
    icon: Factory,
    title: "Fomento de Economías Nacionales",
    description: "Investigación sobre la movilización de recursos y las políticas de fomento económico en la España del XVIII."
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
