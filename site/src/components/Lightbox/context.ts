'use client'

import { createContext, useCallback, useContext } from 'react'
import type { MouseEvent } from 'react'

interface LightboxContextValue {
  open: (element: HTMLImageElement) => void
  close: () => void
}

export const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox (): LightboxContextValue {
  const ctx = useContext(LightboxContext)
  if (!ctx) {
    throw new Error('useLightbox must be used within LightboxProvider')
  }
  return ctx
}

export function useLightboxOpen () {
  const { open } = useLightbox()
  return useCallback((e: MouseEvent<HTMLImageElement>) => {
    if (!e.defaultPrevented) open(e.currentTarget)
  }, [open])
}
