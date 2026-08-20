'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { RecipeCard } from '@components/RecipeCard'
import { Container } from '@components/Container'

import * as api from './api'

interface CollectionPageProps {
  alias: string
}

export function CollectionPage({ alias }: CollectionPageProps) {
  const [key, fetcher] = api.getCollection({
    alias
  })

  const { data: result } = useSWR<api.GetCollectionData>(key, fetcher)

  const articles =
    result?.data?.articles
      ?.map((item) => item.article)
      .filter((article) => !!article) || []

  return (
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <div className="flex flex-col gap-12 md:gap-16">
        {result?.data && (
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
                <Link
                  href="/collections"
                  itemProp="item"
                  className="transition-colors hover:text-[#d36d6d]"
                >
                  <span itemProp="name">Подборки</span>
                </Link>
                <meta itemProp="position" content="2" />
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
                  {result.data.name}
                </span>
                <meta itemProp="position" content="3" />
              </span>
            </nav>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl dark:text-stone-100">
              {result.data.name}
            </h1>

            {result.data.description && (
              <p className="mt-5 max-w-[750px] text-base leading-relaxed text-stone-500 dark:text-stone-400 md:text-lg">
                {result.data.description}
              </p>
            )}
          </header>
        )}

        {(articles?.length || 0) === 0 && (
          <div className="text-center text-xl">
            В этой подборке пока нет статей
          </div>
        )}

        {articles.length > 0 && (
          <section className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {articles.map((article) => (
              <RecipeCard key={article.id} article={article} />
            ))}
          </section>
        )}
      </div>
    </Container>
  )
}
