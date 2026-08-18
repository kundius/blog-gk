'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { fileUrl } from '@app/api/images'
import { Container } from '@components/Container'

import * as api from './api'
import { Card } from './Card'

export function CollectionsPage() {
  const [collectionsKey, collectionsFetcher] = api.getCollections()

  const { data: collectionsResult } = useSWR<api.GetCollectionsData>(
    collectionsKey,
    collectionsFetcher
  )

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
                Подборки
              </span>
              <meta itemProp="position" content="2" />
            </span>
          </nav>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl dark:text-stone-100">
            Подборки
          </h1>
        </header>

        {(collectionsResult?.data?.length || 0) === 0 && (
          <div className="text-center text-xl">
            Записи в данном разделе отсутствуют
          </div>
        )}

        {(collectionsResult?.data?.length || 0) > 0 && (
          <div className="grid grid-cols-2 gap-12">
            {collectionsResult?.data?.map((collection) => (
              <Card
                key={collection.alias}
                name={collection.name}
                description={collection.description}
                count={collection._count?.articles}
                thumbnail={
                  collection.thumbnail
                    ? {
                        name: collection.thumbnail?.title || undefined,
                        blurHash: collection.thumbnail?.blurhash || undefined,
                        url: fileUrl(collection.thumbnail)
                      }
                    : undefined
                }
                href={`/collections/${collection.alias}`}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
