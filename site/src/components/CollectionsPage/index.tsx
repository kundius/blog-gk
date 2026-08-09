'use client'
import React, { useState, useContext, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import { fileUrl } from '@app/api/images'
import { MainLayout } from '@components/MainLayout'
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
    <Container className="mt-20 mb-20">
      <MainLayout>
        <h1 className="mb-12">Подборки</h1>

      {(collectionsResult?.data?.length || 0) === 0 && (
        <div className="text-center text-xl">
          Записи в данном разделе отсутствуют
        </div>
      )}

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
                    url: fileUrl(collection.thumbnail?.filenameDisk)
                  }
                : undefined
            }
            href={`/collections/${collection.alias}`}
          />
        ))}
      </div>
      </MainLayout>
    </Container>
  )
}
