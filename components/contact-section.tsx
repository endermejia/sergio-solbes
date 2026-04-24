import { Card, CardContent } from "@/components/ui/card"
import { Mail, Building2, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-secondary/30 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contacto
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Estoy disponible para colaboraciones académicas, proyectos de investigación 
            y consultas relacionadas con Historia Económica.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="border-border/50 bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-accent/10">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <a 
                  href="mailto:sergio.solbes@ulpgc.es" 
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  sergio.solbes@ulpgc.es
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-accent/10">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Departamento</h3>
                <p className="text-sm text-muted-foreground">
                  Ciencias Históricas<br />ULPGC
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-accent/10">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Ubicación</h3>
                <p className="text-sm text-muted-foreground">
                  Las Palmas de<br />Gran Canaria
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="gap-2">
            <a 
              href="https://accedacris.ulpgc.es/cris/rp/rp01750" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver perfil completo en accedaCRIS
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
