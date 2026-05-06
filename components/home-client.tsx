"use client"

import dynamic from 'next/dynamic'


const AboutSection = dynamic(() => import("@/components/about-section").then(mod => mod.AboutSection))
const ResearchSection = dynamic(() => import("@/components/research-section").then(mod => mod.ResearchSection), { ssr: false })
const ProjectsSection = dynamic(() => import("@/components/projects-section").then(mod => mod.ProjectsSection), { ssr: false })
const PublicationsWrapper = dynamic(() => import("@/components/publications-wrapper").then(mod => mod.PublicationsWrapper), { ssr: false })
const TeachingSection = dynamic(() => import("@/components/teaching-section").then(mod => mod.TeachingSection), { ssr: false })
const ContactSection = dynamic(() => import("@/components/contact-section").then(mod => mod.ContactSection))
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.Footer))

export function HomeClient() {
  return (
    <>
      <main className="flex-1">
        <AboutSection />
        
        <ResearchSection />
        <ProjectsSection />
        <PublicationsWrapper />
        <TeachingSection />

        <ContactSection />
      </main>
      
      <Footer />
    </>
  )
}
