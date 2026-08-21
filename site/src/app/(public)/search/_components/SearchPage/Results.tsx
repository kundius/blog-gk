'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import { useQueryState, parseAsInteger } from 'nuqs'

import { Pagination } from '@components/Pagination'
import { RecipeCard } from '@components/RecipeCard'
import { Spinner } from '@components/Spinner'
import { useScrollOnPageChange } from '@app/lib/hooks/useScrollOnPageChange'

import * as api from './api'

export interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [limit] = useState(20)

  const hasQuery = query.trim().length > 0

  const [key, fetcher] = api.Search({ search: query, limit, page })
  const { data: result, isValidating } = useSWR<api.SearchData>(
    hasQuery ? key : null,
    fetcher,
    { keepPreviousData: true }
  )

  const articles = result?.data ?? []
  const total = result?.meta?.total ?? 0
  const loaded = result !== undefined
  const hasContent = articles.length > 0

  const listRef = useScrollOnPageChange({ page, loaded, hasContent })
  const loadingTransition = loaded && isValidating && hasContent

  if (!hasQuery) {
    return (
      <div className="py-10 text-center text-lg text-muted-foreground">
        Найдите рецепты по названию или ингредиентам
      </div>
    )
  }

  return (
    <section
      ref={listRef}
      style={{ scrollMarginTop: 96 }}
      className="relative flex flex-col gap-10"
    >
      {loadingTransition && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <Spinner className="h-60 w-60 text-[#d36d6d]" />
        </div>
      )}

      {loaded && !hasContent && (
        <div className="py-10 text-center text-lg text-muted-foreground">
          По вашему запросу ничего не найдено
        </div>
      )}

      {hasContent && (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {articles.map((article) => (
            <RecipeCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {total > limit && (
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={(p) => void setPage(p)}
        />
      )}
    </section>
  )
}
