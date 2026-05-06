"use client"

import { useState, useEffect, useRef, ReactNode } from "react"

interface InViewRenderProps {
  children: ReactNode
  id?: string
  className?: string
  rootMargin?: string
  fallbackHeight?: string
}

/**
 * Only renders children when they enter the viewport (plus rootMargin).
 * This is the most effective way to defer hydration of below-the-fold content.
 */
export function InViewRender({ 
  children,
  id,
  className,
  rootMargin = "400px 0px", 
  fallbackHeight = "200px" 
}: InViewRenderProps) {

  const [hasEntered, setHasEntered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasEntered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
        }
      },
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasEntered, rootMargin])

  return (
    <div 
      ref={ref} 
      id={id}
      className={className}
      style={{ minHeight: hasEntered ? "auto" : fallbackHeight }}
    >
      {hasEntered ? children : null}
    </div>
  )
}

