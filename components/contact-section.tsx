import { Card, CardContent } from "@/components/ui/card"
import { Mail, Building2, MapPin, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileData } from "@/lib/data"

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 md:py-28 scroll-mt-20">
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

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
          <Card className="border-border/50 bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-accent/10">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <a 
                  href={`mailto:${profileData.email}`} 
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {profileData.email}
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
                  {profileData.department}<br />ULPGC
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

        {/* Enlaces académicos */}
        <div className="text-center">
          <h3 className="font-medium text-foreground mb-4">Perfiles académicos</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" className="gap-2">
              <a 
                href={profileData.links.accedaCris}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4" />
                accedaCRIS
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a 
                href={`https://orcid.org/${profileData.orcid}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                ORCID
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a 
                href={profileData.links.researchGate}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                ResearchGate
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a 
                href={profileData.links.scholar}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Google Scholar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
