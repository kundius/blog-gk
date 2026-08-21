'use client'
import Script from 'next/script'

export function RecipeSchema({ data }: { data: object }) {
  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
