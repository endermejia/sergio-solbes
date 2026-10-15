"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Award, BookOpen, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Landmark, Briefcase, ScrollText } from "lucide-react"
import { profileData, formacionAcademica, acreditaciones, gestionAcademica, cursosRecibidos } from "@/lib/data"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"

export function AboutSection() {
  const { t } = useLanguage();
  const [showAllAcred, setShowAllAcred] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const displayedAcred = showAllAcred ? acreditaciones : acreditaciones.slice(0, 4);
  const displayedCourses = showAllCourses ? cursosRecibidos : (cursosRecibidos || []).slice(0, 3);

  return (
    <section id="sobre-mi" className="py-20 md:py-28 scroll-mt-16 bg-secondary/20 border-b border-border/40">
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
            Trayectoria & Méritos
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {t('about.title')}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full my-4" />
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Más de tres décadas dedicadas a la investigación de las finanzas de la Corona castellana y a la docencia universitaria.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Bento Cell 1: Trayectoria & Liderazgo (8 cols) */}
          <Card className="lg:col-span-8 border-border/60 bg-card/90 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-7 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-accent font-semibold text-sm">
                  <Landmark className="h-5 w-5" />
                  <span>Trayectoria Docente e Investigadora</span>
                </div>
                
                <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                  <p dangerouslySetInnerHTML={{ __html: t('about.p1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('about.p2') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('about.p3') }} />
                </div>
              </div>

              {/* Verified Institutional Links */}
              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                  Enlaces oficiales:
                </span>
                <a
                  href={`https://orcid.org/${profileData.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary/80 hover:bg-accent/10 hover:text-accent border border-border/60 text-xs font-medium text-foreground transition-colors"
                >
                  <span className="font-bold text-[#A6CE39]">ID</span>
                  <span>ORCID ({profileData.orcid})</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href={profileData.links.researchGate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary/80 hover:bg-accent/10 hover:text-accent border border-border/60 text-xs font-medium text-foreground transition-colors"
                >
                  <span>ResearchGate</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href={profileData.links.iatext}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary/80 hover:bg-accent/10 hover:text-accent border border-border/60 text-xs font-medium text-foreground transition-colors"
                >
                  <span>IATEXT (ULPGC)</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Bento Cell 2: Formación de Máximo Nivel (4 cols) */}
          <Card className="lg:col-span-4 border-border/60 bg-card/90 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-7 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center gap-2.5 text-accent font-semibold text-sm mb-4">
                  <GraduationCap className="h-5 w-5" />
                  <span>{t('about.academic_background')}</span>
                </div>
                
                <div className="space-y-6">
                  {/* Doctorado */}
                  <div className="space-y-1.5 border-l-2 border-accent pl-3.5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm">
                        {t('about.doctorate')}
                      </p>
                      <span className="text-xs font-medium text-accent">
                        {formacionAcademica.doctorado.fecha}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {formacionAcademica.doctorado.universidad}
                    </p>
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      "{formacionAcademica.doctorado.tesis}"
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold">
                        {formacionAcademica.doctorado.calificacion}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Dir: {formacionAcademica.doctorado.director}
                      </span>
                    </div>
                  </div>

                  {/* Licenciatura */}
                  <div className="space-y-1.5 border-l-2 border-border pl-3.5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm">
                        {formacionAcademica.licenciatura.titulo}
                      </p>
                      <span className="text-xs font-medium text-muted-foreground">
                        {formacionAcademica.licenciatura.fecha}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formacionAcademica.licenciatura.universidad} · {formacionAcademica.licenciatura.seccion}
                    </p>
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-secondary text-foreground font-medium">
                      Calificación: {formacionAcademica.licenciatura.notaMedia}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formación complementaria desplegable */}
              {cursosRecibidos && cursosRecibidos.length > 0 && (
                <div className="pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setShowAllCourses(!showAllCourses)}
                    className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
                  >
                    <span>Cursos y seminarios recibidos ({cursosRecibidos.length})</span>
                    {showAllCourses ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {showAllCourses && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                      {cursosRecibidos.map((curso, i) => (
                        <div key={i} className="text-[11px] border-l border-border pl-2">
                          <p className="font-medium text-foreground">{curso.nombre}</p>
                          <p className="text-muted-foreground">{curso.entidad} ({curso.año})</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bento Cell 3: Acreditaciones & Sexenios (5 cols) */}
          <Card className="lg:col-span-5 border-border/60 bg-card/90 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-7 sm:p-8 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-2.5 text-accent font-semibold text-sm mb-4">
                  <ShieldCheck className="h-5 w-5" />
                  <span>{t('about.accreditations')}</span>
                </div>
                
                <ul className="space-y-3.5">
                  {displayedAcred.map((acred, index) => (
                    <li key={index} className="flex items-start justify-between gap-3 border-l-2 border-accent pl-3.5">
                      <div>
                        <p className="font-medium text-foreground text-sm">{acred.titulo}</p>
                        <p className="text-xs text-muted-foreground">{acred.entidad}</p>
                      </div>
                      <span className="text-xs font-semibold text-accent shrink-0">
                        {acred.fecha}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {acreditaciones.length > 4 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllAcred(!showAllAcred)}
                  className="w-full mt-3 gap-1.5 text-xs"
                >
                  {showAllAcred ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      {t('publications.view_less')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      {t('publications.view_more')} ({acreditaciones.length})
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Bento Cell 4: Liderazgo y Gestión Universitaria (7 cols) */}
          <Card className="lg:col-span-7 border-border/60 bg-card/90 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-7 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5 text-accent font-semibold text-sm mb-4">
                <Briefcase className="h-5 w-5" />
                <span>{t('about.management')}</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {gestionAcademica.map((item, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-secondary/50 border border-border/50 space-y-1">
                    <p className="font-semibold text-foreground text-sm">{item.cargo}</p>
                    <p className="text-xs text-muted-foreground">{item.entidad}</p>
                    <p className="text-xs font-semibold text-accent">{item.periodo}</p>
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
