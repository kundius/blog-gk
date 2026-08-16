import React from 'react'

import { formatCookingTime, formatDate } from './format'
import { Hits } from './Hits'
import { LikeButton } from './LikeButton'
import * as styles from './styles.module.css'

export interface ArticleMetaProps {
  id: string
  isRecipe: boolean
  cookingTime?: string | null
  dateCreated: string
  hitsCount: number
  commentsCount: number
  likesCount: number
}

export function ArticleMeta ({
  id,
  isRecipe,
  cookingTime,
  dateCreated,
  hitsCount,
  commentsCount,
  likesCount
}: ArticleMetaProps) {
  const timeLabel = formatCookingTime(cookingTime)
  const dateLabel = formatDate(dateCreated)

  return (
    <div className={styles.meta}>
      {isRecipe && timeLabel && (
        <div className={styles.item}>
          <svg className={styles.metaIcon} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{timeLabel}</span>
          <meta
            itemProp="totalTime"
            content={`PT${(cookingTime ?? '45').replace(/[^0-9]/g, '') || 45}M`}
          />
        </div>
      )}

      <Hits id={id} initialHits={hitsCount} />

      <a href="#comments" className={styles.item}>
        <svg className={styles.metaIcon} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{commentsCount}</span>
      </a>

      <span className={styles.dateSeparator}>|</span>

      {dateLabel && (
        <span className={styles.date}>{dateLabel}</span>
      )}

      <LikeButton id={id} initialLikes={likesCount} />
    </div>
  )
}
