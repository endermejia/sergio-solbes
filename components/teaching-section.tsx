"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, BookOpen, ChevronDown, ChevronUp, Calendar, Award, ExternalLink } from "lucide-react"
import { docencia, direccionTrabajos, proyectosInvestigacion } from "@/lib/data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TeachingSection() {
  const [showMoreTFG, setShowMoreTFG] = useState(false)
  const displayedTFG = showMoreTFG ? direccionTrabajos.tfg : direccionTrabajos.tfg.slice(0, 4)

  return (
    <section id="docencia" className="py-20 md:py-28 bg-secondary/30 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Docencia e Investigación
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Actividad docente universitaria desde 1993 y participación en proyectos de investigación
            de ámbito nacional e internacional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Asignaturas actuales */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-accent" />
                Asignaturas Actuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {docencia.asignaturas.map((asig, index) => (
                  <div key={index} className="border-l-2 border-accent pl-4">
                    <p className="font-medium text-foreground text-sm">{asig.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {asig.titulacion} - {asig.tipo}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {asig.creditos} créditos
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Experiencia total:</strong> {docencia.experiencia.añosDocencia}+ años de docencia universitaria
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Proyectos de Investigación */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-accent" />
                Proyectos de Investigación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {proyectosInvestigacion.slice(0, 4).map((proyecto, index) => (
                  <AccordionItem key={index} value={`proyecto-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="pr-4">
                        <p className="font-medium text-foreground text-sm">{proyecto.titulo}</p>
                        <p className="text-xs text-muted-foreground">{proyecto.periodo}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Referencia:</span> {proyecto.referencia}</p>
                        <p><span className="text-muted-foreground">Investigador Principal:</span> {proyecto.investigadorPrincipal}</p>
                        <p><span className="text-muted-foreground">Entidad financiadora:</span> {proyecto.entidadFinanciadora}</p>
                        {proyecto.participacion && (
                          <Badge variant="secondary" className="text-xs">
                            {proyecto.participacion}
                          </Badge>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-4 w-full gap-2">
                    Ver todos los proyectos ({proyectosInvestigacion.length})
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Proyectos de Investigación</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                      {proyectosInvestigacion.map((proyecto, index) => (
                        <Card key={index} className="border-border/50">
                          <CardContent className="pt-4">
                            <h4 className="font-medium text-foreground text-sm">{proyecto.titulo}</h4>
                            <div className="mt-2 space-y-1 text-xs">
                              <p className="text-accent">{proyecto.periodo}</p>
                              <p className="text-muted-foreground">Ref: {proyecto.referencia}</p>
                              <p className="text-muted-foreground">IP: {proyecto.investigadorPrincipal}</p>
                              <p className="text-muted-foreground">{proyecto.entidadFinanciadora}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Dirección de Trabajos */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tesis Doctorales */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <GraduationCap className="h-5 w-5 text-accent" />
                Tesis Doctorales Dirigidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {direccionTrabajos.tesis.map((tesis, index) => (
                  <div key={index} className="border-l-2 border-accent pl-4">
                    <p className="font-medium text-foreground text-sm">{tesis.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Doctorando: {tesis.doctorando}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tesis.programa} - {tesis.universidad}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={tesis.calificacion.includes("Cum Laude") ? "default" : "secondary"} className="text-xs">
                        {tesis.calificacion}
                      </Badge>
                      <span className="text-xs text-accent">{tesis.fecha}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TFG y TFM */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-accent" />
                TFG y TFM Dirigidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayedTFG.map((trabajo, index) => (
                  <div key={index} className="border-l-2 border-border pl-4">
                    <p className="font-medium text-foreground text-sm">{trabajo.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {trabajo.alumno} - {trabajo.titulacion}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{trabajo.tipo}</Badge>
                      <span className="text-xs text-accent">{trabajo.año}</span>
                      {trabajo.calificacion && (
                        <span className="text-xs text-muted-foreground">({trabajo.calificacion})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {direccionTrabajos.tfg.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMoreTFG(!showMoreTFG)}
                  className="mt-4 w-full"
                >
                  {showMoreTFG ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Ver todos ({direccionTrabajos.tfg.length} trabajos)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
