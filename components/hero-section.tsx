import { MapPin, Building2, BookMarked, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileData, stats } from "@/lib/data"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary via-background to-background" />
      
      <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
          {/* Avatar / Initial */}
          <div className="shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-primary/10 border-4 border-card shadow-lg flex items-center justify-center">
              <span className="font-serif text-5xl md:text-6xl font-bold text-primary">SS</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-widest text-accent mb-3">
              Historiador - Investigador - Docente
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              {profileData.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {profileData.title} en {profileData.area}. 
              Especializado en el estudio de las finanzas públicas y la formación del Estado moderno en el siglo XVIII.
            </p>

            {/* Quick Info */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                <span>{profileData.university}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Las Palmas de Gran Canaria</span>
              </div>
              <div className="flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-accent" />
                <span>Doctor en Historia</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <Button asChild>
                <a href={`mailto:${profileData.email}`}>
                  Contactar
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={profileData.links.accedaCris} target="_blank" rel="noopener noreferrer">
                  Ver CV completo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card/80 rounded-xl border border-border/50 p-6 text-center">
            <p className="font-serif text-3xl font-bold text-foreground">{stats.articulos}</p>
            <p className="mt-1 text-sm text-muted-foreground">Artículos</p>
          </div>
          <div className="bg-card/80 rounded-xl border border-border/50 p-6 text-center">
            <p className="font-serif text-3xl font-bold text-foreground">{stats.libros}</p>
            <p className="mt-1 text-sm text-muted-foreground">Libros</p>
          </div>
          <div className="bg-card/80 rounded-xl border border-border/50 p-6 text-center">
            <p className="font-serif text-3xl font-bold text-foreground">{stats.capitulos}</p>
            <p className="mt-1 text-sm text-muted-foreground">Capítulos</p>
          </div>
          <div className="bg-card/80 rounded-xl border border-border/50 p-6 text-center">
            <p className="font-serif text-3xl font-bold text-foreground">30+</p>
            <p className="mt-1 text-sm text-muted-foreground">Años docencia</p>
          </div>
        </div>
      </div>
    </section>
  )
}
