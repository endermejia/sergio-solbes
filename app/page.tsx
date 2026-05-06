import { profileData } from "@/lib/data"
import esMessages from "@/lib/i18n/messages/es.json"
import { HomeClient } from "@/components/home-client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"


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
    "image": "https://personales.ulpgc.es/sergio.solbes/sergio-solbes-ferri.webp",
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
      <Header />
      <HeroSection />
      <HomeClient />
    </div>
  )
}


