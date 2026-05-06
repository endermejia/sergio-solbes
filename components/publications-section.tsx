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
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export function PublicationsSection() {
  const { t } = useLanguage();
  const [showMoreArticles, setShowMoreArticles] = useState(false)
  const [showMoreBooks, setShowMoreBooks] = useState(false)
  const [showMoreChapters, setShowMoreChapters] = useState(false)
  const [showMoreMeritos, setShowMoreMeritos] = useState(false)
  const [activeTab, setActiveTab] = useState("articulos")

  const statItems = [
    { icon: FileText, value: stats.articulos, label: t('publications.articles'), id: 'articulos' },
    { icon: BookOpen, value: stats.libros, label: t('publications.books'), id: 'libros' },
    { icon: Newspaper, value: stats.capitulos, label: t('publications.chapters'), id: 'capitulos' },
    { icon: BookMarked, value: stats.resenas, label: t('publications.reviews'), id: 'resenas' },
    { icon: Users, value: stats.congresos, label: t('research.stats.congresses'), id: 'congresos' },
    { icon: Award, value: stats.estancias, label: t('research.stats.stays'), id: 'estancias' },
    { icon: BookMarked, value: meritosInvestigacion.length, label: t('research.merits'), id: 'meritos' },
  ]
  
  const handleStatClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById('publicaciones-tabs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.tab) {
        handleStatClick(customEvent.detail.tab);
      }
    };

    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const displayedArticles = showMoreArticles ? publicaciones.articulos : publicaciones.articulos.slice(0, 6)
  const displayedBooks = showMoreBooks ? publicaciones.libros : publicaciones.libros.slice(0, 5)
  const displayedChapters = showMoreChapters ? publicaciones.capitulos : publicaciones.capitulos.slice(0, 5)
  const displayedMeritos = showMoreMeritos ? meritosInvestigacion : meritosInvestigacion.slice(0, 6)

  return (
    <section id="publicaciones" className="py-20 md:py-28 scroll-mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-5xl px-6"
      >
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('publications.title')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('publications.description') || t('profile.bio')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
          {statItems.map((stat) => {
            const isActive = activeTab === stat.id
            return (
              <Card
                key={stat.id}
                className={cn(
                  "border-border/50 bg-card/50 cursor-pointer hover:bg-card/90 transition-all duration-200",
                  isActive ? "ring-2 ring-accent border-accent bg-accent/5" : "hover:border-accent/50"
                )}
                onClick={() => handleStatClick(stat.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <stat.icon className={cn("h-6 w-6 transition-colors", isActive ? "text-accent" : "text-muted-foreground")} />
                    <span className={cn("text-3xl font-bold transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>{stat.value}</span>
                    <span className={cn("text-xs font-medium transition-colors uppercase tracking-wider", isActive ? "text-accent" : "text-muted-foreground/60")}>{stat.label}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Publications Tabs */}
        <div id="publicaciones-tabs" className="scroll-mt-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              {statItems.find(s => s.id === activeTab)?.label}
            </h3>
            <div className="h-px flex-1 bg-border/50 ml-6 hidden md:block" />
          </div>
          
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
                      {t('publications.view_less')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      {t('publications.view_more')} ({publicaciones.articulos.length} {t('publications.articles').toLowerCase()})
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
                      {t('publications.view_less')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      {t('publications.view_more')} ({publicaciones.libros.length} {t('publications.books').toLowerCase()})
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
                      {t('publications.view_less')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      {t('publications.view_more')} ({publicaciones.capitulos.length} {t('publications.chapters').toLowerCase()})
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
                    <h4 className="font-medium text-foreground text-sm leading-snug">{c.trabajo || ""}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{c.congreso}</p>
                    <div className="mt-2 space-y-1">
                      {c.tipo && <p className="text-[10px] text-muted-foreground"><span className="font-medium text-foreground">{t('research.activity_type')}:</span> {c.tipo}</p>}
                      {c.modo && <p className="text-[10px] text-muted-foreground"><span className="font-medium text-foreground">{t('research.participation_mode')}:</span> {c.modo}</p>}
                      <div className="flex justify-between items-center pt-1 border-t border-border/30 mt-1">
                        <span className="text-[10px] text-accent font-medium">{c.ciudad}</span>
                        {c.ambito && <span className="text-[10px] text-muted-foreground/60">{c.ambito}</span>}
                      </div>
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
                      {t('publications.view_more')} ({participacionCongresos.length})
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{t('research.congresses_title')}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4">
                        {participacionCongresos.map((c, index) => (
                          <div key={index} className="p-4 border-b border-border/50 last:border-0 hover:bg-accent/5 transition-colors">
                            <h4 className="font-medium text-sm leading-snug">{c.trabajo || ""}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{c.congreso}</p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                              {c.tipo && <p className="text-[10px] text-muted-foreground"><span className="font-medium text-foreground">{t('research.activity_type')}:</span> {c.tipo}</p>}
                              {c.modo && <p className="text-[10px] text-muted-foreground"><span className="font-medium text-foreground">{t('research.participation_mode')}:</span> {c.modo}</p>}
                              <p className="text-[10px] text-accent font-medium mt-1 col-span-2">
                                {c.ciudad} {c.ambito ? `(${c.ambito})` : ""} {c.organizador ? `- ${c.organizador}` : ""}
                              </p>
                            </div>
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
                      {e.objetivos && (
                        <p className="text-xs mt-1">
                          <span className="font-medium text-foreground">{t('research.stays_objectives')}:</span> {e.objetivos}
                        </p>
                      )}
                      {e.tareas && (
                        <p className="text-xs mt-1 text-muted-foreground">
                          <span className="font-medium text-foreground">{t('research.stays_tasks')}:</span> {e.tareas}
                        </p>
                      )}
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
                        <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-wider whitespace-normal text-left">
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
                    {t('publications.view_less')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    {t('publications.view_more')} ({meritosInvestigacion.length})
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
              {t('hero.cv_button')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
