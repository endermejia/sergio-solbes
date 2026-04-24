import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ResearchSection } from "@/components/research-section"
import { PublicationsSection } from "@/components/publications-section"
import { TeachingSection } from "@/components/teaching-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <PublicationsSection />
        <TeachingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
