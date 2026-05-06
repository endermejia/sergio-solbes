"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, ChevronDown, ChevronUp } from "lucide-react"
import { proyectosInvestigacion } from "@/lib/data"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

export function ProjectsSection() {
  const { t } = useLanguage();
  const [showMore, setShowMore] = useState(false)

  const displayedProjects = showMore 
    ? proyectosInvestigacion 
    : proyectosInvestigacion.slice(0, 6)

  return (
    <section id="proyectos" className="py-20 md:py-28 bg-background scroll-mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-5xl px-6"
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('projects.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayedProjects.map((proyecto, index) => (
            <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base font-semibold leading-tight">
                    {proyecto.titulo}
                  </CardTitle>
                  <Award className="h-5 w-5 text-accent shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-accent font-medium">
                    <span>{proyecto.periodo || t('projects.period')}</span>
                  </div>
                  <p><span className="text-muted-foreground">{t('projects.funding')}:</span> {proyecto.entidadFinanciadora}</p>
                  {proyecto.investigadorPrincipal && (
                    <p><span className="text-muted-foreground">{t('projects.pi')}:</span> {proyecto.investigadorPrincipal}</p>
                  )}
                  {proyecto.participacion && (
                    <Badge variant="secondary" className="mt-2">
                      {proyecto.participacion}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {proyectosInvestigacion.length > 6 && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMore(!showMore)}
              className="gap-2"
            >
              {showMore ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {t('publications.view_less')}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {t('publications.view_more')} ({proyectosInvestigacion.length})
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  )
}
