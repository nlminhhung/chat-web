"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useInView } from "../hooks/use-in-view"

interface AnimatedElementProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
}

export function AnimatedElement({ children, delay = 0, direction = "up", className = "" }: AnimatedElementProps) {
  const [ref, isInView] = useInView<HTMLDivElement>()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true)
    }
  }, [isInView])

  // Define the initial and animated states
  let initialStyles = {}

  switch (direction) {
    case "up":
      initialStyles = { opacity: 0, transform: "translateY(30px)" }
      break
    case "down":
      initialStyles = { opacity: 0, transform: "translateY(-30px)" }
      break
    case "left":
      initialStyles = { opacity: 0, transform: "translateX(30px)" }
      break
    case "right":
      initialStyles = { opacity: 0, transform: "translateX(-30px)" }
      break
    case "none":
      initialStyles = { opacity: 0 }
      break
  }

  const animatedStyles = {
    opacity: 1,
    transform: "translate(0, 0)",
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        ...initialStyles,
        ...(hasAnimated ? animatedStyles : {}),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
