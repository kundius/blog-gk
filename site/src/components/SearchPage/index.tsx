'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useQueryState, parseAsInteger } from 'nuqs'

import { Pagination } from '@components/Pagination'
import { RecipeCard } from '@components/RecipeCard'
import { Container } from '@components/Container'
import { Spinner } from '@components/Spinner'
import { SearchForm } from '@components/HomeSearch/SearchForm'
import { useScrollOnPageChange } from '@app/lib/hooks/useScrollOnPageChange'

import * as api from './api'

export interface SearchPageProps {
  query: string
}

export function SearchPage({ query }: SearchPageProps) {
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

  return (
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <div className="flex flex-col gap-12 md:gap-16">
        <header className="hero-surface rounded-[24px] py-5 px-6 md:py-7 md:px-8 lg:py-10 lg:px-12">
          <nav
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-400 dark:text-stone-400"
            itemScope
            itemType="http://schema.org/BreadcrumbList"
          >
            <span
              itemProp="itemListElement"
              itemScope
              itemType="http://schema.org/ListItem"
            >
              <Link
                href="/"
                itemProp="item"
                className="transition-colors hover:text-[#d36d6d]"
              >
                <span itemProp="name">Главная</span>
              </Link>
              <meta itemProp="position" content="1" />
            </span>
            <span className="text-gray-300 dark:text-stone-600">/</span>
            <span
              itemProp="itemListElement"
              itemScope
              itemType="http://schema.org/ListItem"
            >
              <span
                itemProp="name"
                className="text-gray-600 dark:text-stone-200"
              >
                {`Поиск «${query || '...'}»`}
              </span>
              <meta itemProp="position" content="2" />
            </span>
          </nav>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl dark:text-stone-100">
            Поиск
          </h1>

          <div className="mx-auto mt-6 max-w-[640px]">
            <SearchForm initialQuery={query} />
          </div>
        </header>

        {hasQuery ? (
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
        ) : (
          <div className="py-10 text-center text-lg text-muted-foreground">
            Найдите рецепты по названию или ингредиентам
          </div>
        )}
      </div>
    </Container>
  )
}
