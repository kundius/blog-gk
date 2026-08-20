'use client'
import React from 'react'
import useSWR from 'swr'

import { RecipeCard } from '@components/RecipeCard'

import * as api from './api'

interface ArticleRelatedProps {
  id: string
  title: string
}

export function ArticleRelated({ id, title }: ArticleRelatedProps) {
  const [relatedKey, relatedFetcher] = api.getRelated({
    id,
    limit: 4,
  })

  const { data: relatedResult } = useSWR<api.GetRelatedData>(
    relatedKey,
    relatedFetcher,
  )

  if (!relatedResult?.data || relatedResult.data.length === 0) return null

  return (
    <section className="w-full py-6 md:py-12">
      <div className="mb-6 text-center md:mb-10">
        <h2 className="text-2xl md:text-4xl">{title}</h2>
        <div
          className="mx-auto mt-3 h-1 w-14 rounded-full"
          style={{ backgroundColor: 'var(--main-color)' }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {relatedResult.data.map((article) => (
          <RecipeCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
