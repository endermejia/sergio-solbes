"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, FileText, Newspaper, ChevronDown, ChevronUp, BookMarked, X } from "lucide-react"
import { publicaciones, stats } from "@/lib/data"
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
]

export function PublicationsSection() {
  const [showMoreArticles, setShowMoreArticles] = useState(false)
  const [showMoreBooks, setShowMoreBooks] = useState(false)
  const [showMoreChapters, setShowMoreChapters] = useState(false)
  const [showMoreReviews, setShowMoreReviews] = useState(false)
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

  const displayedArticles = showMoreArticles ? publicaciones.articulos : publicaciones.articulos.filter(x => (x as any).prioridad)
  const displayedBooks = showMoreBooks ? publicaciones.libros : publicaciones.libros.filter(x => (x as any).prioridad)
  const displayedChapters = showMoreChapters ? publicaciones.capitulos : publicaciones.capitulos.filter(x => (x as any).prioridad)
  const displayedReviews = showMoreReviews ? publicaciones.resenas : publicaciones.resenas.filter(x => (x as any).prioridad)

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {statItems.map((stat) => {
            const tabId = stat.label.toLowerCase().replace('í', 'i').replace('ñ', 'n');
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="articulos">Artículos</TabsTrigger>
            <TabsTrigger value="libros">Libros</TabsTrigger>
            <TabsTrigger value="capitulos">Capítulos</TabsTrigger>
            <TabsTrigger value="resenas">Reseñas</TabsTrigger>
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
            
            {publicaciones.articulos.length > publicaciones.articulos.filter((a: any) => a.prioridad).length && (
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
            
            {publicaciones.libros.length > publicaciones.libros.filter((a: any) => a.prioridad).length && (
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
            
            {publicaciones.capitulos.length > publicaciones.capitulos.filter((a: any) => a.prioridad).length && (
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
              {displayedReviews.map((pub, index) => (
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

            {publicaciones.resenas.length > displayedReviews.length && !showMoreReviews && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setShowMoreReviews(true)} className="gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Ver todos ({publicaciones.resenas.length} reseñas)
                </Button>
              </div>
            )}

            {showMoreReviews && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setShowMoreReviews(false)} className="gap-2">
                  <ChevronUp className="h-4 w-4" />
                  Ver menos
                </Button>
              </div>
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
