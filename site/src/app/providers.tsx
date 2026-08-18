'use client'

import React from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { ThemeProvider } from '@components/ThemeContext'
import { LightboxProvider } from '@components/Lightbox'

export function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LightboxProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </LightboxProvider>
    </ThemeProvider>
  )
}
