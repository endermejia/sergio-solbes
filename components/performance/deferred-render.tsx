"use client"

import { useState, useEffect, ReactNode } from "react"

interface DeferredRenderProps {
  children: ReactNode
  delay?: number
  idle?: boolean
}

/**
 * Defers the rendering of a component to free up the main thread during initial load.
 * Can use a fixed delay or wait for the browser to be idle.
 */
export function DeferredRender({ children, delay = 0, idle = false }: DeferredRenderProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (idle && typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(() => setShouldRender(true), { timeout: 2000 })
      return () => (window as any).cancelIdleCallback(handle)
    } else {
      const timer = setTimeout(() => setShouldRender(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay, idle])

  if (!shouldRender) return null

  return <>{children}</>
}
