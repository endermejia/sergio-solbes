"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Landmark, Coins, ScrollText, Shield, Ship, ArrowRight } from "lucide-react"
import { lineasInvestigacion } from "@/lib/data"
import { useLanguage } from "@/lib/i18n/context"

const iconMap: Record<string, React.ElementType> = {
  Building: Landmark,
  Map: Coins,
  Leaf: ScrollText,
  Shield: Shield,
  Ship: Ship,
}

export function ResearchSection() {
  const { t } = useLanguage();
  
  const handleScrollToPublications = () => {
    const el = document.getElementById('publicaciones');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const flagship = lineasInvestigacion[0];
  const complementary = lineasInvestigacion.slice(1);

  return (
    <section id="investigacion" className="py-20 md:py-28 bg-background scroll-mt-16 border-b border-border/40">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl px-6"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            Especialización Historiográfica
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {t('research.lines')}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full my-4" />
          <p 
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t('research.description') }}
          />
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Featured Flagship Line (Spans 12 cols / full width banner) */}
          {flagship && (
            <Card className="lg:col-span-12 border-accent/30 bg-gradient-to-r from-card via-card to-accent/5 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="p-3.5 rounded-2xl bg-accent/10 text-accent shrink-0">
                    <Landmark className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent uppercase tracking-wider">
                        Especialización Principal
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">01</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                      {flagship.titulo}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {flagship.descripcion}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline-accent"
                  size="sm"
                  onClick={handleScrollToPublications}
                  className="gap-2 shrink-0 self-start md:self-center font-medium"
                >
                  <span>Ver publicaciones asociadas</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 4 Complementary Research Pillars (2x2 Grid) */}
          {complementary.map((area, index) => {
            const Icon = iconMap[area.icon] || ScrollText;
            const number = String(index + 2).padStart(2, '0');
            return (
              <Card 
                key={area.titulo} 
                className="lg:col-span-6 border-border/60 bg-card/80 hover:bg-card hover:border-accent/40 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono font-medium text-muted-foreground/60">
                      {number}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                      {area.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {area.descripcion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </section>
  )
}
