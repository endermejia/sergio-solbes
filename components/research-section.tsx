"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Landmark, Coins, ScrollText, Ship, Factory } from "lucide-react"
import { lineasInvestigacion } from "@/lib/data"
import { useLanguage } from "@/lib/i18n/context"

const iconMap: Record<string, React.ElementType> = {
  Building: Landmark,
  Map: Coins,
  Leaf: ScrollText,
  Shield: Ship,
  Ship: Factory,
}

export function ResearchSection() {
  const { t } = useLanguage();
  
  return (
    <section id="investigacion" className="py-20 md:py-28 bg-secondary/30 scroll-mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-5xl px-6"
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('research.lines')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p 
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t('research.description') }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lineasInvestigacion.map((area) => {
            const Icon = iconMap[area.icon] || ScrollText;
            return (
              <Card key={area.titulo} className="border-border/50 bg-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{area.titulo}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {area.descripcion}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </section>
  )
}
