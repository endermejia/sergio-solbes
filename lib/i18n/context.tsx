"use client"

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"

import es from "./messages/es.json"
import en from "./messages/en.json"
import fr from "./messages/fr.json"
import de from "./messages/de.json"

type Messages = typeof es
type Language = "es" | "en" | "fr" | "de"

const messages: Record<Language, Messages> = { es, en, fr, de }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && ["es", "en", "fr", "de"].includes(savedLang)) {
      setLanguage(savedLang)
    } else {
      const browserLang = navigator.language.split("-")[0] as Language
      if (["es", "en", "fr", "de"].includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount to read stored preference

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
      document.documentElement.lang = lang
    }
  }, [])

  const t = useCallback((path: string): string => {
    const keys = path.split(".")
    let current: any = messages[language]
    for (const key of keys) {
      if (current?.[key] === undefined) return path
      current = current[key]
    }
    return typeof current === 'string' ? current : path
  }, [language])

  const contextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t
  }), [language, handleSetLanguage, t])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}


export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
