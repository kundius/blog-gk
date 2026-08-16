import React from 'react'
import Link from 'next/link'
import { BsImage } from 'react-icons/bs'
import { ToqueIcon } from '@components/Icon/toque'
import { CoverImage } from '@components/CoverImage'

import * as styles from './styles.module.css'

export interface ArticleCardRelatedProps {
  name: string
  url: string
  createdAt: string
  excerpt?: string
  category: {
    name: string
    url: string
  }
  thumbnail?: {
    url: string | undefined
    name?: string
    blurHash?: string
  }
}

export function ArticleCardRelated ({
  name,
  url,
  category,
  createdAt,
  thumbnail,
  excerpt
}: ArticleCardRelatedProps) {
  return (
    <div className={styles.Wrapper}>
      <Link href={url} className={styles.MainLink}>
          {thumbnail && (
            <figure className={`${styles.Thumbnail} relative aspect-[5/6] overflow-hidden`}>
              <CoverImage
                src={thumbnail.url ?? ''}
                alt={thumbnail.name || ''}
                blurHash={thumbnail.blurHash}
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </figure>
          )}
          {!thumbnail && (
            <figure className={`${styles.ThumbnailPlaceholder} transition duration-300 ease-out bg-gray-200 dark:bg-gray-600`}>
              <BsImage />
            </figure>
          )}
        </Link>

      <div className={styles.Inner}>
        <div className={styles.Info}>
          <Link href={category.url} className={styles.Category}>{category.name}</Link>
          <div className={styles.Date}>{createdAt}</div>
          <div className={styles.Excerpt}>{excerpt}</div>
          <Link href={url} className={styles.More}>Читать дальше</Link>
        </div>
        <div className={styles.Name}>{name}</div>
      </div>
    </div>
  )
}
