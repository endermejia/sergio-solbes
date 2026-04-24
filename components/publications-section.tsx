import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, FileText, Newspaper, Users } from "lucide-react"

const stats = [
  { icon: FileText, value: "42", label: "Artículos" },
  { icon: BookOpen, value: "12", label: "Libros" },
  { icon: Newspaper, value: "35", label: "Capítulos" },
  { icon: Users, value: "14", label: "Actas de Congresos" },
]

const featuredPublications = [
  {
    year: "2025",
    title: "Fortificaciones. Un elemento clave para la defensa insular de las Monarquías Ibéricas en el largo siglo XVIII",
    type: "Libro",
    coauthors: "con Juan Manuel Santana Pérez (eds.)",
    badge: "Q1"
  },
  {
    year: "2025",
    title: "The man and his circumstances: the historical context of writing the Theórica",
    type: "Capítulo",
    source: "Gerónimo de Uztáriz and his Economic Work, Palgrave Macmillan",
    badge: "Q1"
  },
  {
    year: "2025",
    title: "La recuperación del control financiero de la Corona para la defensa de las Islas Canarias, circa 1720-1770",
    type: "Artículo",
    source: "Revista Tempo",
    badge: "Q2"
  },
  {
    year: "2024",
    title: "Los almacenes de la corte y la provisión del vestuario del ejército de Felipe V durante la Guerra de Sucesión",
    type: "Artículo",
    source: "RiMe - Rivista dell'Istituto di Storia dell'Europa Mediterranea",
    badge: null
  },
  {
    year: "2022",
    title: "La diferencia insular. El modelo fiscal de Canarias en perspectiva histórica",
    type: "Libro",
    coauthors: "con Daniel Castillo Hidalgo",
    badge: "Q1"
  },
  {
    year: "2022",
    title: "Erarios regios: el gobierno de las reales haciendas de la monarquía española y la monarquía francesa en el siglo XVIII",
    type: "Capítulo",
    source: "Crédito y deuda de los erarios regios",
    badge: null
  },
]

export function PublicationsSection() {
  return (
    <section id="publicaciones" className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Publicaciones
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mi producción académica abarca artículos en revistas científicas, libros y capítulos de libro, 
            así como contribuciones a congresos internacionales.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <stat.icon className="h-6 w-6 text-accent" />
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Publications */}
        <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
          Publicaciones destacadas
        </h3>
        <div className="space-y-4 mb-8">
          {featuredPublications.map((pub, index) => (
            <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <span className="shrink-0 text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                    {pub.year}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h4 className="font-medium text-foreground leading-snug">
                        {pub.title}
                      </h4>
                      {pub.badge && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {pub.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs font-normal">
                        {pub.type}
                      </Badge>
                      {pub.coauthors && <span>{pub.coauthors}</span>}
                      {pub.source && <span>{pub.source}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild variant="outline" className="gap-2">
            <a 
              href="https://accedacris.ulpgc.es/cris/rp/rp01750/publicaciones.html?open=all" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver todas las publicaciones
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
