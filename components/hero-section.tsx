import { MapPin, Building2, BookMarked } from "lucide-react"

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
              Historiador · Investigador · Docente
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Sergio Solbes Ferri
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Profesor e investigador especializado en Historia Económica del siglo XVIII, 
              explorando el fascinante mundo de las finanzas y la formación del Estado moderno.
            </p>

            {/* Quick Info */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                <span>Universidad de Las Palmas de Gran Canaria</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Alcoy, 1967</span>
              </div>
              <div className="flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-accent" />
                <span>Doctor en Historia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
