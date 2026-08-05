'use client'

import React from 'react'

import { ThemeProvider } from '@components/ThemeContext'
import { FontLoader } from './font-loader'

export function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FontLoader />
      {children}
    </ThemeProvider>
  )
}
