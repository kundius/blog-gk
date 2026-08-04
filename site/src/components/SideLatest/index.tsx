import React from 'react'
import { DateTime } from 'luxon'
import useSWR from 'swr'

import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import { Card } from './Card'
import styles from './styles.module.css'
import * as api from './api'

const { publicRuntimeConfig } = getRuntimeConfig()

export function SideLatest () {
  const [key, fetcher] = api.getArticles({ limit: 8 })

  const { data: result } = useSWR<api.GetArticlesData>(key, fetcher)

  if (!result?.data) {
    return null
  }

  return (
    <div>
      <div className={styles.Title}>Актуальное</div>
      {result.data.map(item => (
        <Card
          key={item.alias}
          createdAt={DateTime.fromISO(item.date_created).setLocale('ru').toFormat('DDD')}
          href={`/${item.category.section.alias}/${item.category.alias}/${item.alias}`}
          name={item.name}
          category={{
            name: item.category.name,
            href: `/${item.category.section.alias}/${item.category.alias}`
          }}
          thumbnail={
            item.thumbnail
              ? {
                  name: item.thumbnail?.title,
                  blurHash: item.thumbnail?.blurhash,
                  url: `${publicRuntimeConfig.API_URL}/assets/${item.thumbnail?.filename_disk}`
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
