"use client"

import { useEffect, useState } from "react"
import { animate } from "framer-motion"

export function AnimatedCounter({ value, initialValue = 0 }: { value: number; initialValue?: number }) {
  const [displayValue, setDisplayValue] = useState(initialValue)

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [value])

  return <span>{displayValue}</span>
}
