import React, { useContext } from 'react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import { fileUrl } from '@app/api/images'
import { ArticleCardRelated } from '@components/ArticleCardRelated'

import * as api from './api'

interface ArticleRelatedProps {
  id: string
}

export function ArticleRelated({ id }: ArticleRelatedProps) {
  const [relatedKey, relatedFetcher] = api.getRelated({
    id,
    limit: 3
  })

  const { data: relatedResult } = useSWR<api.GetRelatedData>(
    relatedKey,
    relatedFetcher
  )

  if (!relatedResult?.data || relatedResult.data.length === 0) return null

  const items = relatedResult.data.map((item) => (
    <ArticleCardRelated
      key={item.alias}
      name={item.name}
      excerpt={item.excerpt || undefined}
      createdAt={DateTime.fromISO(item.dateCreated)
        .setLocale('ru')
        .toFormat('DDD')}
      thumbnail={
        item.thumbnail
          ? {
              name: item.thumbnail?.title || undefined,
              blurHash: item.thumbnail?.blurhash || undefined,
              url: fileUrl(item.thumbnail?.filenameDisk)
            }
          : undefined
      }
      url={`/${item.category.alias}/${item.alias}`}
      category={{
        name: item.category.name,
        url: `/${item.category.alias}`
      }}
    />
  ))

  return (
    <section>
      <div className="mb-8 md:mb-12 text-gray-400 text-3xl md:text-5xl">
        Смотрите также
      </div>
      <div className="grid md:grid-cols-3 gap-4 lg:gap-8">{items}</div>
    </section>
  )
}
