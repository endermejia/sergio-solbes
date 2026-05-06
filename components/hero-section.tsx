"use client"

import { MapPin, Building2, BookMarked, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profileData, stats } from "@/lib/data"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/context"
import { usePublicationCounts } from "@/lib/publications-context"

export function HeroSection() {
  const { t } = useLanguage();
  const { counts } = usePublicationCounts();

  const handleTabClick = (tabId: string) => {
    // Dispatch event for publications section to update state
    window.dispatchEvent(new CustomEvent('changeTab', { detail: { tab: tabId } }));

    // Scroll to publications section
    const element = document.getElementById('publicaciones-tabs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      const pubSection = document.getElementById('publicaciones');
      if (pubSection) pubSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-secondary via-background to-background" 
      />
      
      <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start"
        >
          {/* Avatar / Photo */}
          <div className="shrink-0">
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-card shadow-lg flex items-center justify-center bg-primary/10">
              {profileData.image ? (
                <Image
                  src={profileData.image}
                  alt={profileData.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <span className="font-serif text-5xl md:text-6xl font-bold text-primary">SS</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-widest text-accent mb-3">
              {t('hero.roles')}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              {profileData.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t('profile.title')} de {t('profile.area')}.{" "}
              {t('hero.description')}
            </p>

            {/* Quick Info */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                <span>{t('profile.university')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{t('hero.location')}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-accent" />
                <span>{t('hero.degree')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <Button asChild>
                <a href="#contacto">
                  {t('hero.contact_button')}
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={profileData.links.accedaCris} target="_blank" rel="noopener noreferrer">
                  {t('hero.cv_button')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div
            onClick={() => handleTabClick('articulos')}
            className="bg-card/80 rounded-xl border border-border/50 p-6 text-center cursor-pointer hover:bg-card/90 hover:border-accent/50 transition-colors"
          >
            <p className={`font-serif text-3xl font-bold text-foreground transition-all${counts.loading ? ' opacity-60 animate-pulse' : ''}`}>
              {counts.articulos}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{t('research.stats.articles')}</p>
          </div>
          <div
            onClick={() => handleTabClick('libros')}
            className="bg-card/80 rounded-xl border border-border/50 p-6 text-center cursor-pointer hover:bg-card/90 hover:border-accent/50 transition-colors"
          >
            <p className={`font-serif text-3xl font-bold text-foreground transition-all${counts.loading ? ' opacity-60 animate-pulse' : ''}`}>
              {counts.libros}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{t('research.stats.books')}</p>
          </div>
          <div
            onClick={() => handleTabClick('capitulos')}
            className="bg-card/80 rounded-xl border border-border/50 p-6 text-center cursor-pointer hover:bg-card/90 hover:border-accent/50 transition-colors"
          >
            <p className={`font-serif text-3xl font-bold text-foreground transition-all${counts.loading ? ' opacity-60 animate-pulse' : ''}`}>
              {counts.capitulos}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{t('research.stats.chapters')}</p>
          </div>
          <div
            onClick={() => handleScrollToSection('proyectos')}
            className="bg-card/80 rounded-xl border border-border/50 p-6 text-center cursor-pointer hover:bg-card/90 hover:border-accent/50 transition-colors"
          >
            <p className="font-serif text-3xl font-bold text-foreground">{stats.proyectos}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('nav.projects')}</p>
          </div>
          <div
            onClick={() => handleScrollToSection('docencia')}
            className="bg-card/80 rounded-xl border border-border/50 p-6 text-center cursor-pointer hover:bg-card/90 hover:border-accent/50 transition-colors"
          >
            <p className="font-serif text-3xl font-bold text-foreground">30+</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('hero.teaching_years')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
