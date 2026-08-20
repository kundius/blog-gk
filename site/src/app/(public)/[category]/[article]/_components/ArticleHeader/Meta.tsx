import React from 'react'

import { Clock, MessageCircle, Users } from 'lucide-react'

import { formatCookingTime, formatDate } from './format'
import { Hits } from './Hits'
import { LikeButton } from './LikeButton'
import * as styles from './styles.module.css'

export interface ArticleMetaProps {
  id: string
  isRecipe: boolean
  cookingTime?: string | null
  portionCount?: string | null
  dateCreated: string
  hitsCount: number
  commentsCount: number
  likesCount: number
}

export function ArticleMeta ({
  id,
  isRecipe,
  cookingTime,
  portionCount,
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
        <div className={styles.item} title="Время приготовления">
          <Clock className={styles.metaIcon} />
          <span>{timeLabel}</span>
          <meta
            itemProp="totalTime"
            content={`PT${(cookingTime ?? '45').replace(/[^0-9]/g, '') || 45}M`}
          />
        </div>
      )}

      {isRecipe && portionCount && (
        <div className={styles.item} title="Количество порций">
          <Users className={styles.metaIcon} />
          <span>{portionCount}</span>
          <meta itemProp="recipeYield" content={`${portionCount} порций`} />
        </div>
      )}

      <Hits id={id} initialHits={hitsCount} />

      <a href="#comments" className={styles.item} title="Комментарии">
        <MessageCircle className={styles.metaIcon} />
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
