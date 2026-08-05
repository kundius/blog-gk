'use client'

import React from 'react'
import { SWRConfig } from 'swr'

export function SWRPreload ({ preloadData, children }: { preloadData?: Record<string, unknown>, children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fallback: preloadData || {} }}>
      {children}
    </SWRConfig>
  )
}
