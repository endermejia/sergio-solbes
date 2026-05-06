"use client"

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react"

import { stats as localStats } from "@/lib/data"

interface LiveCounts {
  articulos: number
  libros: number
  capitulos: number
  resenas: number
  /** true while the accedaCris list hasn't arrived yet */
  loading: boolean
}

interface PublicationsContextType {
  counts: LiveCounts
  setCounts: (counts: Partial<LiveCounts>) => void
}

const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined)

export function PublicationsProvider({ children }: { children: ReactNode }) {
  const [counts, setCountsState] = useState<LiveCounts>({
    articulos: localStats.articulos,
    libros: localStats.libros,
    capitulos: localStats.capitulos,
    resenas: localStats.resenas ?? 0,
    loading: true,
  })

  const setCounts = useCallback((partial: Partial<LiveCounts>) =>
    setCountsState(prev => ({ ...prev, ...partial })), [])

  const contextValue = useMemo(() => ({ counts, setCounts }), [counts, setCounts])

  return (
    <PublicationsContext.Provider value={contextValue}>
      {children}
    </PublicationsContext.Provider>
  )
}


export function usePublicationCounts() {
  const ctx = useContext(PublicationsContext)
  if (!ctx) throw new Error("usePublicationCounts must be used inside PublicationsProvider")
  return ctx
}
