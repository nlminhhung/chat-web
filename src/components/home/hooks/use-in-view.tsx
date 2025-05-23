"use client"

import { useEffect, useState, useRef, type RefObject } from "react"

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        ...options,
      },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return [ref, isInView]
}
