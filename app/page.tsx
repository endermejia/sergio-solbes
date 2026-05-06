import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ResearchSection } from "@/components/research-section"
import { ProjectsSection } from "@/components/projects-section"
import { TeachingSection } from "@/components/teaching-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { profileData } from "@/lib/data"
import esMessages from "@/lib/i18n/messages/es.json"
import { PublicationsProvider } from "@/lib/publications-context"
import { PublicationsWrapper } from "@/components/publications-wrapper"

export default async function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profileData.name,
    "jobTitle": esMessages.profile.title,
    "affiliation": {
      "@type": "Organization",
      "name": esMessages.profile.university
    },
    "url": "https://personales.ulpgc.es/sergio.solbes/",
    "image": "https://personales.ulpgc.es/sergio.solbes/sergio-profile.png",
    "sameAs": [
      profileData.links.accedaCris,
      profileData.links.researchGate,
      `https://orcid.org/${profileData.orcid}`
    ],
    "description": esMessages.profile.bio
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicationsProvider>
        <Header />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <ResearchSection />
          <ProjectsSection />
          <PublicationsWrapper />
          <TeachingSection />
          <ContactSection />
        </main>
        <Footer />
      </PublicationsProvider>
    </div>
  )
}
