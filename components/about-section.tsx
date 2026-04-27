"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Award, BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { profileData, formacionAcademica, acreditaciones, gestionAcademica } from "@/lib/data"
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

const highlights = [
  {
    icon: GraduationCap,
    title: "Formación",
    description: "Licenciado y Doctor en Historia por la Universidad de Navarra"
  },
  {
    icon: Users,
    title: "Docencia",
    description: "Facultad de Economía, Empresa y Turismo - Facultad de Geografía e Historia"
  },
  {
    icon: Award,
    title: "Investigación",
    description: "Coordinador del Grupo DPHA del Instituto IATEXT"
  },
  {
    icon: BookOpen,
    title: "Especialidad",
    description: "Historia Económica - Siglo XVIII - Fiscalidad"
  },
]

export function AboutSection() {
  const [showAllAcred, setShowAllAcred] = useState(false)
  const [showAllGestion, setShowAllGestion] = useState(false)

  const displayedAcred = showAllAcred ? acreditaciones : acreditaciones.filter(a => (a as any).prioridad)
  const displayedGestion = showAllGestion ? gestionAcademica : gestionAcademica.filter(g => (g as any).prioridad)

  return (
    <section id="sobre-mi" className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sobre mí
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Desde 1993 desarrollo mi labor docente e investigadora en el <strong className="text-foreground">Departamento 
              de Ciencias Históricas</strong> de la Universidad de Las Palmas de Gran Canaria. Mi formación 
              académica incluye la licenciatura y el doctorado en Historia por la Universidad de Navarra, 
              con especialización en Historia Económica.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Actualmente formo parte del Grupo de Investigación <strong className="text-foreground">&quot;Documentación, 
              Patrimonio e Historia Atlántica&quot; (DPHA)</strong> del Instituto Universitario de Análisis y 
              Aplicaciones Textuales (IATEXT), del cual soy coordinador.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              A lo largo de mi trayectoria he asumido diversas responsabilidades académicas y de gestión: 
              Secretario del Departamento de Ciencias Históricas, miembro del Claustro Universitario, 
              coordinador del Área de Historia Económica, coordinador del GIR-DPHA y del Grupo de 
              Innovación Educativa en Economía e Historia (GIZEH).
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://orcid.org/${profileData.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                ORCID <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={profileData.links.researchGate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                ResearchGate <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={profileData.links.iatext}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
              >
                IATEXT <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formación Académica y Acreditaciones */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Formación Académica */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Formación Académica
              </h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="licenciatura">
                  <AccordionTrigger className="text-left">
                    <div>
                      <p className="font-medium text-foreground">{formacionAcademica.licenciatura.titulo}</p>
                      <p className="text-sm text-muted-foreground">{formacionAcademica.licenciatura.universidad}, {formacionAcademica.licenciatura.fecha}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">División:</span> {formacionAcademica.licenciatura.division}</p>
                      <p><span className="text-muted-foreground">Sección:</span> {formacionAcademica.licenciatura.seccion}</p>
                      <p><span className="text-muted-foreground">Ciudad:</span> {formacionAcademica.licenciatura.ciudad}</p>
                      <p><span className="text-muted-foreground">Calificación:</span> <span className="text-accent font-medium">{formacionAcademica.licenciatura.notaMedia}</span></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="doctorado">
                  <AccordionTrigger className="text-left">
                    <div>
                      <p className="font-medium text-foreground">Doctor en Historia</p>
                      <p className="text-sm text-muted-foreground">{formacionAcademica.doctorado.universidad}, {formacionAcademica.doctorado.fecha}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Programa:</span> {formacionAcademica.doctorado.programa}</p>
                      <p><span className="text-muted-foreground">Tesis:</span> <span className="italic">{formacionAcademica.doctorado.tesis}</span></p>
                      <p><span className="text-muted-foreground">Director:</span> {formacionAcademica.doctorado.director}</p>
                      <p><span className="text-muted-foreground">Calificación:</span> <span className="text-accent font-medium">{formacionAcademica.doctorado.calificacion}</span></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Acreditaciones */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Acreditaciones y Reconocimientos
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
              
              {acreditaciones.length > acreditaciones.filter((a: any) => a.prioridad).length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllAcred(!showAllAcred)}
                  className="mt-4 w-full"
                >
                  {showAllAcred ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Ver todos ({acreditaciones.length})
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
                Gestión Académica y Responsabilidades
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedGestion.map((item, index) => (
                  <div key={index} className="space-y-1 border-l-2 border-border pl-4">
                    <p className="font-medium text-foreground text-sm">{item.cargo}</p>
                    <p className="text-xs text-muted-foreground">{item.entidad}</p>
                    <p className="text-xs text-accent">{item.periodo}</p>
                  </div>
                ))}
              </div>

              {gestionAcademica.length > displayedGestion.length && !showAllGestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllGestion(true)}
                  className="mt-6 w-full"
                >
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Ver todos ({gestionAcademica.length})
                </Button>
              )}
              {showAllGestion && (
                <Button variant="ghost" size="sm" onClick={() => setShowAllGestion(false)} className="mt-6 w-full">
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Ver menos
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
