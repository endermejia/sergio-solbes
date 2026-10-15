"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { proyectosInvestigacion } from "@/lib/data"
import { getProjectsList } from "@/lib/actions/publications"
import { ProyectoInvestigacion } from "@/lib/types"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

export function ProjectsSection() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<ProyectoInvestigacion[]>(proyectosInvestigacion);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getProjectsList()
      .then((liveProjects) => {
        if (isMounted && liveProjects && liveProjects.length > 0) {
          setProjects(liveProjects);
        }
      })
      .catch((err) => {
        console.error("Error updating live projects list:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedProjects = showMore 
    ? projects 
    : projects.slice(0, 6);

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
            <Card key={index} className="border-border/50 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-semibold leading-tight">
                      {proyecto.titulo}
                    </CardTitle>
                    <Award className="h-5 w-5 text-accent shrink-0 mt-0.5" />
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
                    {proyecto.referencia && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{t('projects.reference')}:</span> {proyecto.referencia}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {proyecto.participacion && (
                        <Badge variant="secondary">
                          {proyecto.participacion}
                        </Badge>
                      )}
                      {proyecto.cuantia && (
                        <Badge variant="outline" className="border-accent/40 text-accent font-medium text-xs">
                          {proyecto.cuantia}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>

              {proyecto.handle && (
                <div className="px-6 pb-4 pt-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/5 p-0"
                  >
                    <a href={proyecto.handle} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t('projects.view_in_acceda')}
                    </a>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {projects.length > 6 && (
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
                  {t('publications.view_more')} ({projects.length})
                </>
              )}
            </Button>
          )}

          <Button asChild variant="outline" size="lg" className="gap-2">
            <a
              href="https://accedacris.ulpgc.es/entities/person/rp01750/projects"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('projects.view_all_projects')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
