"use client"

import dynamic from 'next/dynamic'

const PublicationsSectionContent = dynamic(
  () => import("./publications-section").then(mod => mod.PublicationsSection),
  { ssr: false }
)

export function PublicationsWrapper() {
  return <PublicationsSectionContent />
}
