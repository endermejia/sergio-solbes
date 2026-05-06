"use client"
import { useState, useEffect } from "react"
import { profileData } from "@/lib/data"
import { useLanguage } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useLanguage();
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg font-semibold text-foreground">
              {profileData.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('profile.title')} · {t('profile.university')}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href={profileData.links.accedaCris}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              accedaCRIS
            </a>
            <a
              href={`https://orcid.org/${profileData.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              ORCID
            </a>
            <a
              href={profileData.links.researchGate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              ResearchGate
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left text-xs text-muted-foreground">
            <p>© {year} {profileData.name}. {t('footer.rights')}</p>
          </div>
          
          <div className="flex items-center gap-8 bg-white/50 p-2 rounded-lg">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('footer.developed_by')}</span>
              <a 
                href="https://www.linkedin.com/in/gabrimejia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Gabriel Mejía
              </a>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('footer.funding')}</span>
              <a 
                href="https://www.ciencia.gob.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity"
              >
                <img 
                  src={profileData.logos.ministerio} 
                  alt="Logo Ministerio y AEI" 
                  className="h-16 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
