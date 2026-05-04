import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ResearchSection } from "@/components/research-section"
import { ProjectsSection } from "@/components/projects-section"
import { PublicationsSection } from "@/components/publications-section"
import { TeachingSection } from "@/components/teaching-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { profileData } from "@/lib/data"

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profileData.name,
    "jobTitle": profileData.title,
    "affiliation": {
      "@type": "Organization",
      "name": profileData.university
    },
    "url": "https://personales.ulpgc.es/sergio.solbes/",
    "image": "https://personales.ulpgc.es/sergio.solbes/sergio-profile.png",
    "sameAs": [
      profileData.links.accedaCris,
      profileData.links.researchGate,
      `https://orcid.org/${profileData.orcid}`
      // Add other social links if available in profileData
    ],
    "description": profileData.bio
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <ProjectsSection />
        <PublicationsSection />
        <TeachingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
