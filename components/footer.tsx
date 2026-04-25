import { profileData } from "@/lib/data"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg font-semibold text-foreground">
              {profileData.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {profileData.title} · {profileData.university}
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
            <p>© {new Date().getFullYear()} {profileData.name}. Todos los derechos reservados.</p>
          </div>
          
          <div className="flex items-center gap-8 bg-white/50 p-2 rounded-lg">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Desarrolla:</span>
              <img 
                src={profileData.logos.lugar} 
                alt="Logo LU(G)AR" 
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Financia:</span>
              <img 
                src={profileData.logos.ministerio} 
                alt="Logo Ministerio y AEI" 
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
