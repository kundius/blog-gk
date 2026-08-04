import { DateTime } from 'luxon'
import React, { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'

import * as api from '../api'
import styles from './styles.module.css'

export interface CardProps {
  id: string
}

export const Card = ({
  id
}: CardProps) => {
  const [key, fetcher] = api.GetArticle({ id })
  const { data: result } = useSWR<api.GetArticleData>(key, fetcher)

  if (!result) {
    return (
      <div>
        <div className="text-xl mb-2">
          <Skeleton />
        </div>
        <div className="text-xs">
          <Skeleton count={3}/>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Date}>
        {DateTime.fromISO(result.data.date_created).setLocale('ru').toFormat('DDD')}
      </div>
      <div className={styles.Title}>
        <Link href={`/${result.data.category.section.alias}/${result.data.category.alias}/${result.data.alias}`} passHref>
          <a>{result.data.name}</a>
        </Link>
      </div>
      <div className={styles.Excerpt}>
        {result.data.excerpt}
      </div>
    </div>
  )
}
