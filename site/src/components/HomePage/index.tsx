'use client'
import React, { useMemo } from 'react'
import useSWR from 'swr'

import { listArticles } from '@app/api/articles'
import { listCollections } from '@app/api/collections'
import { fileUrl } from '@app/api/images'
import type { ArticleListItem, Collection } from '@app/api/types'
import { Container } from '@components/Container'
import { Hero } from '@components/Hero'
import { HomeSearch } from '@components/HomeSearch'
import { CulinarySections } from '@components/CulinarySections'
import { RecipeCard } from '@components/RecipeCard'
import { Card as CollectionCard } from '@components/CollectionsPage/Card'

function seasonRange(): { from: string; to: string } {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  let start: Date
  if (month >= 11 || month <= 1) {
    start = new Date(month >= 11 ? year : year - 1, 11, 1)
  } else if (month <= 4) {
    start = new Date(year, 2, 1)
  } else if (month <= 7) {
    start = new Date(year, 5, 1)
  } else {
    start = new Date(year, 8, 1)
  }
  return { from: start.toISOString(), to: now.toISOString() }
}

export function HomePage() {
  const { from, to } = useMemo(() => seasonRange(), [])
  const [keyPopular, fetcherPopular] = listArticles({
    limit: 4,
    sort: '-hitsCount',
    dateFrom: from,
    dateTo: to
  })
  const { data: popular } = useSWR<{ data: ArticleListItem[] }>(keyPopular, fetcherPopular)

  const [keyFresh, fetcherFresh] = listArticles({ limit: 4, sort: '-dateCreated' })
  const { data: fresh } = useSWR<{ data: ArticleListItem[] }>(keyFresh, fetcherFresh)

  const [keyCollections, fetcherCollections] = listCollections({ featured: true })
  const { data: collections } = useSWR<{ data: Collection[] }>(keyCollections, fetcherCollections)

  return (
    <div className="my-16">
      <Container>
        <Hero />
        <div className="mx-auto w-full max-w-[640px] mt-16 mb-8 lg:mt-24 lg:mb-12">
          <HomeSearch />
        </div>
      </Container>

      <CulinarySections />

      <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24">
        <Container>
          <div className="mb-6 text-center md:mb-10">
            <h2 className="text-2xl md:text-4xl">Тематические подборки</h2>
            <div
              className="mx-auto mt-3 h-1 w-14 rounded-full"
              style={{ backgroundColor: 'var(--main-color)' }}
            />
          </div>
          {(collections === undefined || collections.data.length > 0) && (
            <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
              {!collections
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-muted">
                      <div className="aspect-[5/6] bg-muted" />
                      <div className="space-y-3 p-5">
                        <div className="h-4 w-2/3 rounded-full bg-muted" />
                      </div>
                    </div>
                  ))
                : collections.data.map((collection) => (
                    <CollectionCard
                      key={collection.alias}
                      name={collection.name}
                      description={collection.description}
                      count={collection._count?.articles}
                      href={`/collections/${collection.alias}`}
                      thumbnail={
                        collection.thumbnail
                          ? {
                              name: collection.thumbnail?.title || undefined,
                              blurHash: collection.thumbnail?.blurhash || undefined,
                              url: fileUrl(collection.thumbnail)
                            }
                          : undefined
                      }
                    />
                  ))}
            </div>
          )}
        </Container>
      </section>

      <section className="hero-surface relative w-full pt-12 pb-16 md:pt-20 md:pb-24">
        <Container>
          <div className="mb-6 text-center md:mb-10">
            <h2 className="text-2xl md:text-4xl">Лучшее в этом сезоне</h2>
            <div
              className="mx-auto mt-3 h-1 w-14 rounded-full"
              style={{ backgroundColor: 'var(--main-color)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {!popular ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-muted">
                  <div className="aspect-video bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded-full bg-muted" />
                    <div className="h-3 w-full rounded-full bg-muted" />
                  </div>
                </div>
              ))
            ) : (
              popular.data.map((article) => <RecipeCard key={article.id} article={article} />)
            )}
          </div>
        </Container>
      </section>

      <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24">
        <Container>
          <div className="mb-6 text-center md:mb-10">
            <h2 className="text-2xl md:text-4xl">Свежее на блоге</h2>
            <div
              className="mx-auto mt-3 h-1 w-14 rounded-full"
              style={{ backgroundColor: 'var(--main-color)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {!fresh ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-muted">
                  <div className="aspect-video bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded-full bg-muted" />
                    <div className="h-3 w-full rounded-full bg-muted" />
                  </div>
                </div>
              ))
            ) : (
              fresh.data.map((article) => <RecipeCard key={article.id} article={article} />)
            )}
          </div>
        </Container>
      </section>
    </div>
  )
}
