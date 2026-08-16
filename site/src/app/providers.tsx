'use client'

import React from 'react'

import { ThemeProvider } from '@components/ThemeContext'
import { LightboxProvider } from '@components/Lightbox'

export function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LightboxProvider>
        {children}
      </LightboxProvider>
    </ThemeProvider>
  )
}
