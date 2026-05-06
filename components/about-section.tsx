"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Award, BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { profileData, formacionAcademica, acreditaciones, gestionAcademica, cursosRecibidos } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

export function AboutSection() {
  const { t } = useLanguage();
  const [showAllAcred, setShowAllAcred] = useState(false)
  const displayedAcred = showAllAcred ? acreditaciones : acreditaciones.slice(0, 4)

  const highlights = [
    {
      icon: GraduationCap,
      title: t('about.highlights.formation_title') || t('about.academic_background'),
      description: t('about.highlights.formation'),
      href: "#formacion"
    },
    {
      icon: Users,
      title: t('teaching.title'),
      description: t('about.highlights.teaching'),
      href: "#docencia"
    },
    {
      icon: Award,
      title: t('research.title'),
      description: t('about.highlights.research'),
      href: "#investigacion"
    },
    {
      icon: BookOpen,
      title: t('about.highlights.specialization_title') || t('about.subtitle'),
      description: t('about.highlights.specialization'),
      href: "#publicaciones"
    },
  ]

  return (
    <section id="sobre-mi" className="py-20 md:py-28 scroll-mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-5xl px-6"
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('about.title')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-8">
            <div className="space-y-6">
              <p 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.p1') }}
              />
              <p 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.p2') }}
              />
            </div>
          </div>
          <div className="space-y-8">
            <p 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t('about.p3') }}
            />
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
              <a
                href={`https://orcid.org/${profileData.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline transition-colors"
              >
                ORCID <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={profileData.links.researchGate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline transition-colors"
              >
                ResearchGate <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={profileData.links.iatext}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline transition-colors"
              >
                IATEXT <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {highlights.map((item) => (
            <div 
              key={item.title} 
              onClick={(e) => {
                e.preventDefault();
                const id = item.href.slice(1);
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="group block h-full cursor-pointer"
            >
              <Card className="border-border/50 bg-card/50 h-full transition-all hover:bg-accent/5 hover:border-accent/50 hover:shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Formación Académica y Acreditaciones */}
        <div className="grid md:grid-cols-2 gap-8 scroll-mt-24">
          {/* Formación Académica */}
          <Card id="formacion" className="border-border/50 scroll-mt-24">
            <CardContent className="pt-6">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                {t('about.academic_background')}
              </h3>
              
              <Accordion type="single" collapsible className="w-full">
                 <AccordionItem value="licenciatura">
                  <AccordionTrigger className="text-left">
                    <div>
                      <p className="font-medium text-foreground">{t('about.bachelors')}</p>
                      <p className="text-sm text-muted-foreground">{formacionAcademica.licenciatura.universidad}, {formacionAcademica.licenciatura.fecha}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">{t('about.division')}:</span> {formacionAcademica.licenciatura.division}</p>
                      <p><span className="text-muted-foreground">{t('about.section_label')}:</span> {formacionAcademica.licenciatura.seccion}</p>
                      <p><span className="text-muted-foreground">{t('about.city')}:</span> {formacionAcademica.licenciatura.ciudad}</p>
                      <p><span className="text-muted-foreground">{t('about.grade')}:</span> <span className="text-accent font-medium">{formacionAcademica.licenciatura.notaMedia}</span></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="doctorado">
                  <AccordionTrigger className="text-left">
                    <div>
                      <p className="font-medium text-foreground">{t('about.doctorate')}</p>
                      <p className="text-sm text-muted-foreground">{formacionAcademica.doctorado.universidad}, {formacionAcademica.doctorado.fecha}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">{t('about.program')}:</span> {formacionAcademica.doctorado.programa}</p>
                      <p><span className="text-muted-foreground">{t('about.thesis')}:</span> <span className="italic">{formacionAcademica.doctorado.tesis}</span></p>
                      <p><span className="text-muted-foreground">{t('about.director')}:</span> {formacionAcademica.doctorado.director}</p>
                      <p><span className="text-muted-foreground">{t('about.grade')}:</span> <span className="text-accent font-medium">{formacionAcademica.doctorado.calificacion}</span></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {cursosRecibidos && cursosRecibidos.length > 0 && (
                  <AccordionItem value="cursos">
                    <AccordionTrigger className="text-left">
                      <div>
                        <p className="font-medium text-foreground">{t('about.courses')}</p>
                        <p className="text-sm text-muted-foreground">{t('about.complementary_formation')} ({cursosRecibidos.length} {t('teaching.subjects').toLowerCase()})</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="h-48 pr-4">
                        <div className="space-y-3">
                          {cursosRecibidos.map((curso, i) => (
                            <div key={i} className="text-xs border-l-2 border-border pl-2">
                              <p className="font-medium">{curso.nombre}</p>
                              <p className="text-muted-foreground">{curso.entidad} ({curso.año})</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>

          {/* Acreditaciones */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                {t('about.accreditations')}
              </h3>
              
              <ul className="space-y-4">
                {displayedAcred.map((acred, index) => (
                  <li key={index} className="border-l-2 border-accent pl-4">
                    <p className="font-medium text-foreground text-sm">{acred.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{acred.entidad}</p>
                    <p className="text-xs text-accent">{acred.fecha}</p>
                  </li>
                ))}
              </ul>
              
              {acreditaciones.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllAcred(!showAllAcred)}
                  className="mt-4 w-full"
                >
                  {showAllAcred ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      {t('publications.view_less')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      {t('publications.view_more')} ({acreditaciones.length})
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gestión Académica - New Section */}
        <div className="mt-8">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                {t('about.management')}
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gestionAcademica.map((item, index) => (
                  <div key={index} className="space-y-1 border-l-2 border-border pl-4">
                    <p className="font-medium text-foreground text-sm">{item.cargo}</p>
                    <p className="text-xs text-muted-foreground">{item.entidad}</p>
                    <p className="text-xs text-accent">{item.periodo}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </section>
  )
}
