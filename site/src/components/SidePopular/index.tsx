import React from 'react'
import { DateTime } from 'luxon'
import useSWR from 'swr'

import { fileUrl } from '@app/api/images'

import { Card } from './Card'
import styles from './styles.module.css'
import * as api from './api'

export function SidePopular () {
  const [key, fetcher] = api.getArticles({ limit: 5 })

  const { data: result } = useSWR<api.GetArticlesData>(key, fetcher)

  if (!result?.data) {
    return null
  }

  return (
    <div>
      <div className={styles.Title}>Популярное</div>
      {result.data.map(item => (
        <Card
          key={item.alias}
          createdAt={DateTime.fromISO(item.dateCreated, { zone: 'utc' }).setLocale('ru').toFormat('DDD')}
          href={`/${item.category.alias}/${item.alias}`}
          name={item.name}
          category={{
            name: item.category.name,
            href: `/${item.category.alias}`
          }}
          thumbnail={
            item.thumbnail
              ? {
                  name: item.thumbnail?.title || undefined,
                  blurHash: item.thumbnail?.blurhash || undefined,
                  url: fileUrl(item.thumbnail)
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
