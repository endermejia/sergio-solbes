"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, FileText, Newspaper, ChevronDown, ChevronUp, BookMarked, X, Users, Award } from "lucide-react"
import { publicaciones, stats, participacionCongresos, estanciasInvestigacion, meritosInvestigacion } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const statItems = [
  { icon: FileText, value: stats.articulos, label: "Artículos" },
  { icon: BookOpen, value: stats.libros, label: "Libros" },
  { icon: Newspaper, value: stats.capitulos, label: "Capítulos" },
  { icon: BookMarked, value: stats.resenas, label: "Reseñas" },
  { icon: Users, value: stats.congresos, label: "Congresos" },
  { icon: Award, value: stats.estancias, label: "Estancias" },
  { icon: BookMarked, value: meritosInvestigacion.length, label: "Méritos" },
]

export function PublicationsSection() {
  const [showMoreArticles, setShowMoreArticles] = useState(false)
  const [showMoreBooks, setShowMoreBooks] = useState(false)
  const [showMoreChapters, setShowMoreChapters] = useState(false)
  const [showMoreMeritos, setShowMoreMeritos] = useState(false)
  const [activeTab, setActiveTab] = useState("articulos")
  
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };

    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const handleStatClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById('publicaciones-tabs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayedArticles = showMoreArticles ? publicaciones.articulos : publicaciones.articulos.slice(0, 6)
  const displayedBooks = showMoreBooks ? publicaciones.libros : publicaciones.libros.slice(0, 5)
  const displayedChapters = showMoreChapters ? publicaciones.capitulos : publicaciones.capitulos.slice(0, 5)
  const displayedMeritos = showMoreMeritos ? meritosInvestigacion : meritosInvestigacion.slice(0, 6)

  return (
    <section id="publicaciones" className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Publicaciones
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mi producción académica abarca artículos en revistas científicas, libros y capítulos de libro, 
            así como contribuciones a congresos internacionales.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
          {statItems.map((stat) => {
            const tabId = stat.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return (
              <Card
                key={stat.label}
                className="border-border/50 bg-card/50 cursor-pointer hover:bg-card/90 hover:border-accent/50 transition-colors"
                onClick={() => handleStatClick(tabId)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <stat.icon className="h-6 w-6 text-accent" />
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Publications Tabs */}
        <div id="publicaciones-tabs" className="scroll-mt-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto mb-8">
            <TabsTrigger value="articulos">Artículos</TabsTrigger>
            <TabsTrigger value="libros">Libros</TabsTrigger>
            <TabsTrigger value="capitulos">Capítulos</TabsTrigger>
            <TabsTrigger value="resenas">Reseñas</TabsTrigger>
            <TabsTrigger value="congresos">Congresos</TabsTrigger>
            <TabsTrigger value="estancias">Estancias</TabsTrigger>
            <TabsTrigger value="meritos">Méritos</TabsTrigger>
          </TabsList>
          
          {/* Artículos */}
          <TabsContent value="articulos">
            <div className="space-y-3">
              {displayedArticles.map((pub, index) => (
                <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <span className="shrink-0 text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                        {pub.año}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground leading-snug text-sm">
                          {pub.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pub.autores}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {pub.revista}{pub.volumen ? `, ${pub.volumen}` : ""}{pub.paginas ? `, pp. ${pub.paginas}` : ""}
                        </p>
                        {pub.indices && (
                          <Badge variant="secondary" className="mt-2 text-xs font-normal whitespace-normal text-left">
                            {pub.indices}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {publicaciones.articulos.length > 6 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowMoreArticles(!showMoreArticles)}
                  className="gap-2"
                >
                  {showMoreArticles ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Ver todos ({publicaciones.articulos.length} artículos)
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Libros */}
          <TabsContent value="libros">
            <div className="space-y-3">
              {displayedBooks.map((pub, index) => (
                <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <span className="shrink-0 text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                        {pub.año}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground leading-snug text-sm">
                          {pub.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pub.autores}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pub.editorial}{pub.ciudad ? `, ${pub.ciudad}` : ""}
                        </p>
                        {pub.isbn && (
                          <p className="text-xs text-muted-foreground">
                            ISBN: {pub.isbn}
                          </p>
                        )}
                        <Badge variant="outline" className="mt-2 text-xs font-normal">
                          {pub.tipo}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {publicaciones.libros.length > 5 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowMoreBooks(!showMoreBooks)}
                  className="gap-2"
                >
                  {showMoreBooks ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Ver todos ({publicaciones.libros.length} libros)
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Capítulos */}
          <TabsContent value="capitulos">
            <div className="space-y-3">
              {displayedChapters.map((pub, index) => (
                <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <span className="shrink-0 text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                        {pub.año}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground leading-snug text-sm">
                          {pub.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pub.autores}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          En: {pub.libro}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pub.editorial}{pub.paginas ? `, pp. ${pub.paginas}` : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {publicaciones.capitulos.length > 5 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowMoreChapters(!showMoreChapters)}
                  className="gap-2"
                >
                  {showMoreChapters ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Ver todos ({publicaciones.capitulos.length} capítulos)
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Reseñas */}
          <TabsContent value="resenas">
            <div className="space-y-3">
              {publicaciones.resenas.map((pub, index) => (
                <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <span className="shrink-0 text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                        {pub.año}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground leading-snug text-sm">
                          {pub.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {pub.revista}, {pub.volumen}{pub.paginas ? `, pp. ${pub.paginas}` : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Congresos */}
          <TabsContent value="congresos">
            <div className="space-y-3">
              {participacionCongresos.slice(0, 10).map((c, index) => (
                <Card key={index} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="py-4">
                    <h4 className="font-medium text-foreground text-sm">{c.trabajo || "Sin título"}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{c.congreso}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-accent">{c.ciudad}</span>
                      <span className="text-xs text-muted-foreground">{c.organizador}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {participacionCongresos.length > 10 && (
              <div className="mt-6 text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Ver todos los congresos ({participacionCongresos.length})
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Listado Completo de Congresos</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4">
                        {participacionCongresos.map((c, index) => (
                          <div key={index} className="p-4 border-b border-border/50">
                            <h4 className="font-medium text-sm">{c.trabajo || "Sin título"}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{c.congreso}</p>
                            <p className="text-[10px] text-accent mt-1">{c.ciudad} - {c.organizador}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>

          {/* Estancias */}
          <TabsContent value="estancias">
            <div className="space-y-4">
              {estanciasInvestigacion.map((e, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-foreground">{e.entidad}</h4>
                        <Badge variant="outline">{e.duracion}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{e.centro}</p>
                      <p className="text-xs text-accent italic">{e.programa}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Otros Méritos */}
          <TabsContent value="meritos">
            <div className="space-y-4">
              {displayedMeritos && displayedMeritos.map((m, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-wider">
                          {m.categoria}
                        </Badge>
                        <h4 className="font-medium text-foreground text-sm leading-snug">{m.titulo}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {m.entidad}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-accent font-medium">{m.fecha}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {meritosInvestigacion.length > 6 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowMoreMeritos(!showMoreMeritos)} 
                className="mt-4 w-full"
              >
                {showMoreMeritos ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Ver todos ({meritosInvestigacion.length})
                  </>
                )}
              </Button>
            )}
          </TabsContent>
        </Tabs>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button asChild variant="default" className="gap-2">
            <a 
              href="https://accedacris.ulpgc.es/cris/rp/rp01750/publicaciones.html?open=all" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ver listado completo en accedaCRIS
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
