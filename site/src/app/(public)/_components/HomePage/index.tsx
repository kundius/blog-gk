'use client'
import React from 'react'
import useSWR from 'swr'

import { listArticles } from '@app/api/articles'
import { listCollections } from '@app/api/collections'
import { fileUrl } from '@app/api/images'
import type { ArticleListItem, Collection } from '@app/api/types'
import { Container } from '@components/Container'
import { Hero } from '../Hero'
import { HomeSearch } from '@components/HomeSearch'
import { CulinarySections } from '../CulinarySections'
import { RecipeCard } from '@components/RecipeCard'
import { Card as CollectionCard } from '@components/CollectionsPage/Card'

export interface HomePageProps {
  period: { from: string; to: string }
}

export function HomePage({ period }: HomePageProps) {
  const [keyPopular, fetcherPopular] = listArticles({
    limit: 4,
    sort: '-hitsCount',
    dateFrom: period.from,
    dateTo: period.to
  })
  const { data: popular } = useSWR<{ data: ArticleListItem[] }>(keyPopular, fetcherPopular)

  const [keyFresh, fetcherFresh] = listArticles({ limit: 4, sort: '-dateCreated' })
  const { data: fresh } = useSWR<{ data: ArticleListItem[] }>(keyFresh, fetcherFresh)

  const [keyCollections, fetcherCollections] = listCollections({ featured: true })
  const { data: collections } = useSWR<{ data: Collection[] }>(keyCollections, fetcherCollections)

  return (
    <div className="mt-12 mb-16 md:mt-16 md:mb-24">
      <Container>
        <Hero />
        <div className="mx-auto w-full max-w-[640px] mt-16 mb-8 lg:mt-24 lg:mb-12">
          <HomeSearch />
        </div>
      </Container>

      <CulinarySections />

      {(collections?.data.length ?? 0) > 0 && (
        <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24">
          <Container>
            <div className="mb-6 text-center md:mb-10">
              <h2 className="text-2xl md:text-4xl">Тематические подборки</h2>
              <div
                className="mx-auto mt-3 h-1 w-14 rounded-full"
                style={{ backgroundColor: 'var(--main-color)' }}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
              {collections?.data.map((collection) => (
                <CollectionCard
                  key={collection.alias}
                  name={collection.name}
                  description={collection.description}
                  count={collection._count?.articles}
                  href={`/collections/${collection.alias}`}
                  thumbnail={
                    collection.thumbnail
                      ? {
                          name: collection.thumbnail?.filenameDownload || undefined,
                          blurHash: collection.thumbnail?.blurhash || undefined,
                          url: fileUrl(collection.thumbnail)
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </Container>
        </section>
      )}

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
            {popular?.data.map((article) => (
              <RecipeCard key={article.id} article={article} />
            ))}
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
            {fresh?.data.map((article) => (
              <RecipeCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
