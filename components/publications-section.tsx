"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, FileText, Newspaper, ChevronDown, ChevronUp, BookMarked, X, Users, Award, Loader2 } from "lucide-react"
import { profileData, publicaciones, stats as localStats, participacionCongresos, estanciasInvestigacion, meritosInvestigacion } from "@/lib/data"
import { getPublicationDetails, getPublicationList } from "@/lib/actions/publications"
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
import { usePublicationCounts } from "@/lib/publications-context"

import { Publicaciones } from "@/lib/types"

function LazyLoadWrapper({ 
  handle, 
  detailsLoaded, 
  onVisible, 
  children 
}: { 
  handle?: string; 
  detailsLoaded?: boolean; 
  onVisible: () => void; 
  children: React.ReactNode 
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailsLoaded || !handle) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible();
          observer.disconnect();
        }
      },
      { rootMargin: "150px" } // trigger 150px before entering viewport
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [handle, detailsLoaded, onVisible]);

  return <div ref={ref}>{children}</div>;
}

export function PublicationsSection({ initialData }: { initialData?: Publicaciones }) {
  const { t } = useLanguage();
  const { setCounts } = usePublicationCounts();
  // Start with mock data — never block render on network
  const [data, setData] = useState<Publicaciones>(initialData || publicaciones);
  // loadingList is false by default since mock data is immediately available
  const [loadingList, setLoadingList] = useState(false);
  const [showMoreArticles, setShowMoreArticles] = useState(false)
  const [showMoreBooks, setShowMoreBooks] = useState(false)
  const [showMoreChapters, setShowMoreChapters] = useState(false)
  const [showMoreMeritos, setShowMoreMeritos] = useState(false)
  const [showMoreActas, setShowMoreActas] = useState(false)
  const [congressSubTab, setCongressSubTab] = useState<'actas' | 'participaciones'>('actas')
  const [activeTab, setActiveTab] = useState("articulos")
  const [sectionIntersected, setSectionIntersected] = useState(true)

  // Track which tabs have already had their details loaded
  const detailsLoadedForTab = useRef<Set<string>>(new Set())
  // Keep a ref to the latest data so the detail-enrichment closure sees it
  const dataRef = useRef(data)
  useEffect(() => { dataRef.current = data }, [data])

  const sectionRef = useRef<HTMLElement>(null!)

  // --- Phase 1: Fetch live list in background to update mock data if available ---
  const listFetchedRef = useRef(false)
  useEffect(() => {
    if (initialData || listFetchedRef.current) return;
    
    listFetchedRef.current = true;
    const fetchList = async () => {
      try {
        const list = await getPublicationList();
        if (list && (list.articulos.length > 0 || list.libros.length > 0 || list.capitulos.length > 0)) {
          setData(list);
          // Broadcast live counts to the shared context → HeroSection will update
          setCounts({
            articulos: list.articulos.length,
            libros: list.libros.length,
            capitulos: list.capitulos.length,
            resenas: list.resenas.length,
            loading: false,
          });
        }
      } catch (e) {
        console.error("Error updating publications from live network call, using mock data fallback:", e);
      }
    };

    fetchList();
  }, [initialData, setCounts]);



  const loadingHandles = useRef<Set<string>>(new Set())

  const loadDetailsForItem = async (handle: string, type: 'articulo' | 'libro' | 'capitulo' | 'resena' | 'acta') => {
    if (!handle || loadingHandles.current.has(handle)) return;

    loadingHandles.current.add(handle);

    try {
      const details = await getPublicationDetails(handle);
      setData(prev => {
        const newData = { ...prev };
        const updateItem = (arr: any[]) =>
          arr.map(p => p.handle === handle ? { ...p, ...details, detailsLoaded: true } : p);
        
        if (type === 'articulo') newData.articulos = updateItem(newData.articulos);
        else if (type === 'libro')    newData.libros    = updateItem(newData.libros);
        else if (type === 'capitulo') newData.capitulos = updateItem(newData.capitulos);
        else if (type === 'resena')   newData.resenas   = updateItem(newData.resenas);
        else if (type === 'acta')     newData.actas     = updateItem(newData.actas || []);
        return newData;
      });
    } catch (e) {
      console.error("Error loading publication details:", e);
    } finally {
      loadingHandles.current.delete(handle);
    }
  };

  // Stats: always show local (hardcoded) counts immediately; swap to live counts once loaded
  const statItems = [
    { icon: FileText, value: loadingList ? localStats.articulos : data.articulos.length, label: t('publications.articles'), id: 'articulos', loading: loadingList },
    { icon: BookOpen, value: loadingList ? localStats.libros : data.libros.length, label: t('publications.books'), id: 'libros', loading: loadingList },
    { icon: Newspaper, value: loadingList ? localStats.capitulos : data.capitulos.length, label: t('publications.chapters'), id: 'capitulos', loading: loadingList },
    { icon: BookMarked, value: loadingList ? localStats.resenas ?? 0 : data.resenas.length, label: t('publications.reviews'), id: 'resenas', loading: loadingList },
    { icon: Users, value: localStats.congresos, label: t('research.stats.congresses'), id: 'congresos', loading: false },
    { icon: Award, value: localStats.estancias, label: t('research.stats.stays'), id: 'estancias', loading: false },
    { icon: BookMarked, value: meritosInvestigacion.length, label: t('research.merits'), id: 'meritos', loading: false },
  ]
  
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleStatClick = (tabId: string) => {
    setActiveTab(tabId);
    setSectionIntersected(true);

    const tabEl = tabRefs.current[tabId];
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Scroll smoothly so the first item of the newly selected tab is positioned directly below the sticky tabs bar
    setTimeout(() => {
      const tabsContainer = document.getElementById('publicaciones-tabs');
      if (tabsContainer) {
        const headerHeight = 64; // Main navbar height (h-16)
        const containerDocTop = window.scrollY + tabsContainer.getBoundingClientRect().top;
        const targetScrollY = Math.max(0, containerDocTop - headerHeight);

        // Only scroll if difference is noticeable
        if (Math.abs(window.scrollY - targetScrollY) > 8) {
          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        }
      }
    }, 40);
  };

  const handleCongressSubTabChange = (subTab: 'actas' | 'participaciones') => {
    setCongressSubTab(subTab);
    setTimeout(() => {
      const tabsContainer = document.getElementById('publicaciones-tabs');
      if (tabsContainer) {
        const headerHeight = 64;
        const containerDocTop = window.scrollY + tabsContainer.getBoundingClientRect().top;
        const targetScrollY = Math.max(0, containerDocTop - headerHeight);
        if (Math.abs(window.scrollY - targetScrollY) > 8) {
          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        }
      }
    }, 40);
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

  const displayedArticles = showMoreArticles ? data.articulos : data.articulos.slice(0, 6)
  const displayedBooks = showMoreBooks ? data.libros : data.libros.slice(0, 5)
  const displayedChapters = showMoreChapters ? data.capitulos : data.capitulos.slice(0, 5)
  const displayedMeritos = showMoreMeritos ? meritosInvestigacion : meritosInvestigacion.slice(0, 6)

  return (
    <section id="publicaciones" className="py-20 md:py-28 scroll-mt-16 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            Producción Científica
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {t('publications.title')}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full my-4" />
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {t('publications.description') || t('profile.bio')}
          </p>
        </motion.div>

        {/* Publications Tabs & Sticky Category Cards */}
        <div id="publicaciones-tabs" className="scroll-mt-20">
          <Tabs value={activeTab} onValueChange={(val) => handleStatClick(val)} className="w-full">
            
            {/* Sticky Cards Tab Bar: sticks under navbar while user is in the publications section */}
            <div 
              id="publicaciones-tabs-bar"
              className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/95 backdrop-blur-md border-y border-border/70 shadow-xs mb-8 transition-all"
            >
              <div className="flex lg:grid lg:grid-cols-7 gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                {statItems.map((stat) => {
                  const isActive = activeTab === stat.id;
                  return (
                    <button
                      key={stat.id}
                      ref={(el) => { tabRefs.current[stat.id] = el; }}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleStatClick(stat.id)}
                      className={cn(
                        "shrink-0 min-w-[110px] sm:min-w-[125px] lg:min-w-0 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all duration-200 select-none group focus:outline-none cursor-pointer",
                        isActive
                          ? "bg-card border-accent shadow-xs ring-2 ring-accent/25 text-accent font-semibold"
                          : "bg-card/40 border-border/60 hover:bg-card hover:border-accent/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <stat.icon className={cn("h-4 w-4 transition-colors shrink-0", isActive ? "text-accent" : "text-muted-foreground/70 group-hover:text-accent")} />
                        <span className={cn(
                          "text-lg sm:text-xl font-serif font-bold transition-colors leading-none",
                          isActive ? "text-foreground" : "text-foreground/85 group-hover:text-foreground",
                          stat.loading ? "opacity-60 animate-pulse" : ""
                        )}>
                          {stat.value}
                        </span>
                      </div>
                      <span className={cn(
                        "text-[11px] sm:text-xs tracking-tight line-clamp-1 transition-colors text-center",
                        isActive ? "text-accent font-semibold" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {stat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Artículos */}
            <TabsContent value="articulos">
            {loadingList && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border/50 p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="h-7 w-12 rounded bg-muted/60 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-muted/60" />
                        <div className="h-3 w-1/2 rounded bg-muted/40" />
                        <div className="h-3 w-2/3 rounded bg-muted/40" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3">
              {displayedArticles.map((pub, index) => (
                <LazyLoadWrapper
                  key={index}
                  handle={pub.handle}
                  detailsLoaded={pub.detailsLoaded}
                  onVisible={() => pub.handle && loadDetailsForItem(pub.handle, 'articulo')}
                >
                  <Card className="border-border/50 hover:shadow-sm transition-shadow">
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
                            {pub.revista}{pub.volumen ? `, ${t('publications.volume')} ${pub.volumen}` : ""}{pub.paginas ? `, ${t('publications.pages')} ${pub.paginas}` : ""}
                          </p>
                          {pub.indices && (
                            <Badge variant="secondary" className="mt-2 text-xs font-normal whitespace-normal text-left">
                              {pub.indices}
                            </Badge>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pub.clasificacion?.map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs font-normal">
                                {c}
                              </Badge>
                            ))}
                          </div>
                          {pub.pdfUrl ? (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/5 p-0"
                                onClick={() => window.open(pub.pdfUrl, "_blank")}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t('publications.view_pdf')}
                              </Button>
                            </div>
                          ) : pub.handle && !pub.detailsLoaded && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 italic animate-pulse">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  {t('publications.loading_details') || 'Cargando...'}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LazyLoadWrapper>
              ))}
            </div>
            
            {data.articulos.length > 6 && (
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
                      {t('publications.view_more')} ({data.articulos.length} {t('publications.articles').toLowerCase()})
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
                <LazyLoadWrapper
                  key={index}
                  handle={pub.handle}
                  detailsLoaded={pub.detailsLoaded}
                  onVisible={() => pub.handle && loadDetailsForItem(pub.handle, 'libro')}
                >
                  <Card className="border-border/50 hover:shadow-sm transition-shadow">
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
                              {t('publications.isbn')}: {pub.isbn}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pub.clasificacion && pub.clasificacion.length > 0 ? (
                              pub.clasificacion.map((c, i) => (
                                <Badge key={i} variant="outline" className="text-xs font-normal">
                                  {c}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-xs font-normal">
                                {pub.tipo}
                              </Badge>
                            )}
                          </div>
                          {pub.pdfUrl ? (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/5 p-0"
                                onClick={() => window.open(pub.pdfUrl, "_blank")}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t('publications.view_pdf')}
                              </Button>
                            </div>
                          ) : pub.handle && !pub.detailsLoaded && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 italic animate-pulse">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  {t('publications.loading_details') || 'Cargando...'}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LazyLoadWrapper>
              ))}
            </div>
            
            {data.libros.length > 5 && (
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
                      {t('publications.view_more')} ({data.libros.length} {t('publications.books').toLowerCase()})
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
                <LazyLoadWrapper
                  key={index}
                  handle={pub.handle}
                  detailsLoaded={pub.detailsLoaded}
                  onVisible={() => pub.handle && loadDetailsForItem(pub.handle, 'capitulo')}
                >
                  <Card className="border-border/50 hover:shadow-sm transition-shadow">
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
                            {t('publications.in')}: {pub.libro}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pub.editorial}{pub.paginas ? `, ${t('publications.pages')} ${pub.paginas}` : ""}
                          </p>
                          {pub.isbn && (
                            <p className="text-xs text-muted-foreground">
                              {t('publications.isbn')}: {pub.isbn}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pub.clasificacion && pub.clasificacion.length > 0 ? (
                              pub.clasificacion.map((c, i) => (
                                <Badge key={i} variant="outline" className="text-xs font-normal">
                                  {c}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-xs font-normal">
                                {pub.tipo || t('publications.chapters')}
                              </Badge>
                            )}
                          </div>
                          {pub.pdfUrl ? (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/5 p-0"
                                onClick={() => window.open(pub.pdfUrl, "_blank")}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t('publications.view_pdf')}
                              </Button>
                            </div>
                          ) : pub.handle && !pub.detailsLoaded && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 italic animate-pulse">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  {t('publications.loading_details') || 'Cargando...'}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LazyLoadWrapper>
              ))}
            </div>
            
            {data.capitulos.length > 5 && (
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
                      {t('publications.view_more')} ({data.capitulos.length} {t('publications.chapters').toLowerCase()})
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Reseñas */}
          <TabsContent value="resenas">
            <div className="space-y-3">
              {data.resenas.map((pub, index) => (
                <LazyLoadWrapper
                  key={index}
                  handle={pub.handle}
                  detailsLoaded={pub.detailsLoaded}
                  onVisible={() => pub.handle && loadDetailsForItem(pub.handle, 'resena')}
                >
                  <Card className="border-border/50 hover:shadow-sm transition-shadow">
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
                            {pub.revista}{pub.volumen ? `, ${t('publications.volume')} ${pub.volumen}` : ""}{pub.paginas ? `, ${t('publications.pages')} ${pub.paginas}` : ""}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pub.clasificacion?.map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs font-normal">
                                {c}
                              </Badge>
                            ))}
                          </div>
                          {pub.pdfUrl ? (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/5 p-0"
                                onClick={() => window.open(pub.pdfUrl, "_blank")}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t('publications.view_pdf')}
                              </Button>
                            </div>
                          ) : pub.handle && !pub.detailsLoaded && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 italic animate-pulse">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  {t('publications.loading_details') || 'Cargando...'}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LazyLoadWrapper>
              ))}
            </div>
          </TabsContent>

          {/* Congresos */}
          <TabsContent value="congresos">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={congressSubTab === 'actas' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCongressSubTabChange('actas')}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {t('publications.proceedings')} ({(data.actas || []).length})
              </Button>
              <Button
                variant={congressSubTab === 'participaciones' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCongressSubTabChange('participaciones')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                {t('publications.all_participations')} ({participacionCongresos.length})
              </Button>
            </div>

            {congressSubTab === 'actas' ? (
              <>
                <div className="space-y-3">
                  {((showMoreActas ? data.actas : data.actas?.slice(0, 6)) || []).map((pub, index) => (
                    <LazyLoadWrapper
                      key={index}
                      handle={pub.handle}
                      detailsLoaded={pub.detailsLoaded}
                      onVisible={() => pub.handle && loadDetailsForItem(pub.handle, 'acta')}
                    >
                      <Card className="border-border/50 hover:shadow-sm transition-shadow">
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
                              {pub.revista && (
                                <p className="text-xs text-muted-foreground italic mt-1">
                                  {pub.revista}{pub.paginas ? `, ${t('publications.pages')} ${pub.paginas}` : ""}
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap gap-2">
                                {pub.clasificacion?.map((c, i) => (
                                  <Badge key={i} variant="outline" className="text-xs font-normal">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                {pub.pdfUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/5 p-0"
                                    onClick={() => window.open(pub.pdfUrl, "_blank")}
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    {t('publications.view_pdf')}
                                  </Button>
                                )}
                                {pub.handle && (
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/5 p-0"
                                  >
                                    <a href={pub.handle} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      {t('publications.view_in_acceda')}
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </LazyLoadWrapper>
                  ))}
                </div>

                {(data.actas || []).length > 6 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowMoreActas(!showMoreActas)}
                      className="gap-2"
                    >
                      {showMoreActas ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          {t('publications.view_less')}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          {t('publications.view_more')} ({(data.actas || []).length})
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
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
                variant="outline" 
                size="sm" 
                onClick={() => setShowMoreMeritos(!showMoreMeritos)} 
                className="mt-4 w-full gap-1.5 text-xs"
              >
                {showMoreMeritos ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    {t('publications.view_less')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
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
              href={profileData.links.accedaCris} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t('hero.cv_button')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
