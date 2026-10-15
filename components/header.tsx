"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Menu, X, BookOpen, GraduationCap, FileText, Mail, Briefcase, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageSelector } from "@/components/language-selector"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [showNavName, setShowNavName] = useState(false)
  const { t } = useLanguage()

  const navItems = useMemo(() => [
    { href: "#sobre-mi", label: t("nav.about"), icon: GraduationCap },
    { href: "#investigacion", label: t("nav.research"), icon: BookOpen },
    { href: "#proyectos", label: t("nav.projects"), icon: Award },
    { href: "#publicaciones", label: t("nav.publications"), icon: FileText },
    { href: "#docencia", label: t("nav.teaching"), icon: Briefcase },
    { href: "#contacto", label: t("nav.contact"), icon: Mail },
  ], [t]);

  useEffect(() => {
    // 1. Initial scroll handling for deep-links
    const handleInitialScroll = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    };

    handleInitialScroll();

    // 2. Scroll-spy logic (UI highlight only, no URL changes)
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (navItems.some(item => item.href === `#${id}`)) {
            setActiveSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const updateObservers = () => {
      const elements = document.querySelectorAll('[id]');
      elements.forEach((el) => {
        if (navItems.some(item => item.href === `#${el.id}`)) {
          observer.observe(el);
        }
      });
    };

    updateObservers();
    const scanInterval = setInterval(updateObservers, 1000);

    const handleScroll = () => {
      const heroElement = document.getElementById("hero-name");
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        setShowNavName(rect.top <= 60);
      } else {
        setShowNavName(window.scrollY > 100);
      }

      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearInterval(scanInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('a') ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('nav')
    ) {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      onClick={handleHeaderClick}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 cursor-pointer"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group min-h-7"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            {/* Mobile Brand: Permanent, authoritative, never leaves an empty bar */}
            <div className="flex flex-col md:hidden py-0.5">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-foreground leading-tight">
                Sergio Solbes Ferri
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground leading-none mt-0.5">
                Catedrático · ULPGC
              </span>
            </div>

            {/* Desktop Brand: Crossfades title to full name on scroll to avoid duplication with hero */}
            <div className="hidden md:flex items-center h-8">
              <div className="relative flex items-center">
                <span
                  className={cn(
                    "font-serif text-sm tracking-wide text-muted-foreground transition-all duration-300 ease-out whitespace-nowrap",
                    showNavName
                      ? "opacity-0 -translate-y-3 pointer-events-none absolute"
                      : "opacity-100 translate-y-0"
                  )}
                >
                  {t("hero.title")} · ULPGC
                </span>
                <span
                  className={cn(
                    "font-serif text-lg font-semibold text-foreground transition-all duration-300 ease-out whitespace-nowrap",
                    showNavName
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3 pointer-events-none absolute"
                  )}
                >
                  Sergio Solbes Ferri
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full",
                      isActive 
                        ? "text-accent bg-accent/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="w-px h-6 bg-border/50 mx-2" />
            <LanguageSelector />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t("publications.view_less") : t("publications.view_more")}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown (Popup overlay) */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="md:hidden absolute top-full left-0 right-0 w-full border-b border-border/70 bg-background/98 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
                      isActive
                        ? "text-accent bg-accent/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
