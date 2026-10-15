"use client"

import { Building2, GraduationCap, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileData, stats } from "@/lib/data"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"
import { usePublicationCounts } from "@/lib/publications-context"
import { AnimatedCounter } from "@/components/ui/counter"

export function HeroSection() {
  const { t } = useLanguage();
  const { counts } = usePublicationCounts();

  const handleTabClick = (tabId: string) => {
    // Dispatch event for publications section to update state
    window.dispatchEvent(new CustomEvent('changeTab', { detail: { tab: tabId } }));

    // Scroll to publications section
    const element = document.getElementById('publicaciones');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-secondary/15 to-background">
      {/* Background subtle radial glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(160,50,40,0.06),transparent)]" 
      />
      
      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-14 md:pt-16 md:pb-20">
        {/* Main Hero: Asymmetric 2-Column Golden Ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Academic Credentials & Presentation (7 cols) */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            
            {/* Institution & Department pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border/60 text-xs font-medium text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-accent" />
              <span>Universidad de Las Palmas de Gran Canaria</span>
              <span className="text-border">·</span>
              <span className="text-foreground font-semibold">{t('hero.department') || "Dpto. de Ciencias Históricas"}</span>
            </div>

            {/* Name & Academic Title */}
            <div>
              <h1
                id="hero-name"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance"
              >
                {profileData.name}
              </h1>
              <p className="mt-2 text-lg sm:text-xl font-medium text-accent tracking-wide">
                {t('profile.title')} de {t('profile.area')}
              </p>
            </div>

            {/* Bio / Research Mission */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
              {t('hero.description')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Button 
                onClick={() => handleScrollToSection('contacto')}
                className="gap-2 shadow-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                {t('hero.contact_button')}
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={profileData.links.accedaCris} target="_blank" rel="noopener noreferrer">
                  {t('hero.cv_button')}
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </a>
              </Button>
            </div>

            {/* Academic Profiles & Scientific Identity (Lightweight chips, no bulky cards) */}
            <div className="w-full pt-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground/80 font-semibold mb-2.5">
                Perfiles &amp; Producción Científica
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <a
                  href={`https://orcid.org/${profileData.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-accent/40 text-xs font-medium text-foreground transition-all duration-150 group"
                >
                  <span className="font-bold text-[#A6CE39] group-hover:scale-105 transition-transform">ID</span>
                  <span>ORCID</span>
                  <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100" />
                </a>

                <a
                  href={profileData.links.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-accent/40 text-xs font-medium text-foreground transition-all duration-150 group"
                >
                  <span className="font-bold text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">GS</span>
                  <span>Google Scholar</span>
                  <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100" />
                </a>

                <a
                  href={profileData.links.researchGate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-accent/40 text-xs font-medium text-foreground transition-all duration-150 group"
                >
                  <span className="font-bold text-[#00CCBB] group-hover:scale-105 transition-transform">RG</span>
                  <span>ResearchGate</span>
                  <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100" />
                </a>

                <a
                  href={profileData.links.accedaCris}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-accent/40 text-xs font-medium text-foreground transition-all duration-150 group"
                >
                  <Building2 className="h-3 w-3 text-accent group-hover:scale-105 transition-transform" />
                  <span>accedaCRIS ULPGC</span>
                  <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Master Editorial Portrait (Unobstructed & Dignified) */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            <div className="w-full max-w-[190px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px]">
              
              {/* Portrait Container without rotated underlays or intrusive overlay badges */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted/30 border border-border/80 shadow-xl shadow-black/5 dark:shadow-black/25">
                {profileData.image ? (
                  <Image
                    src={profileData.image}
                    alt={profileData.name}
                    fill
                    unoptimized={true}
                    priority
                    className="object-cover object-[center_12%] select-none transition-transform duration-500 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="font-serif text-6xl font-bold text-primary">SS</span>
                  </div>
                )}
              </div>

              {/* Dignified Editorial Caption beneath portrait */}
              <div className="mt-3.5 px-1 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                <div className="flex items-center gap-1.5 font-medium text-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Instituto Universitario IATEXT</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">GIR · DPHA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Stats - Banda horizontal académica panorámica (1 sola línea en desktop) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-border/70"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 md:gap-y-0 md:divide-x md:divide-border/60">
            <button
              type="button"
              onClick={() => handleTabClick('articulos')}
              className="px-2 lg:px-4 py-2 text-center cursor-pointer transition-colors focus:outline-none col-span-1 group hover:bg-secondary/30 rounded-lg"
            >
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                <AnimatedCounter value={counts.articulos} />
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {t('research.stats.articles')}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('libros')}
              className="px-2 lg:px-4 py-2 text-center cursor-pointer transition-colors focus:outline-none col-span-1 group hover:bg-secondary/30 rounded-lg"
            >
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                <AnimatedCounter value={counts.libros} />
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {t('research.stats.books')}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('capitulos')}
              className="px-2 lg:px-4 py-2 text-center cursor-pointer transition-colors focus:outline-none col-span-1 group hover:bg-secondary/30 rounded-lg"
            >
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                <AnimatedCounter value={counts.capitulos} />
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {t('research.stats.chapters')}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleScrollToSection('proyectos')}
              className="px-2 lg:px-4 py-2 text-center cursor-pointer transition-colors focus:outline-none col-span-1 group hover:bg-secondary/30 rounded-lg"
            >
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                {stats.proyectos}
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {t('nav.projects')}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleScrollToSection('docencia')}
              className="px-2 lg:px-4 py-2 text-center cursor-pointer transition-colors focus:outline-none col-span-2 md:col-span-1 group hover:bg-secondary/30 rounded-lg"
            >
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                30+
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {t('hero.teaching_years')}
              </p>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
