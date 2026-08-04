import React from 'react'
import Link from 'next/link'

import { Image } from '@components/Image'
import { BsImage } from 'react-icons/bs'
import { ToqueIcon } from '@components/Icon/toque'

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
    url: string
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
      <Link href={url} passHref>
        <a className={styles.MainLink}>
          {thumbnail && (
            <figure className={styles.Thumbnail}>
              <Image
                src={thumbnail.url}
                alt={thumbnail.name}
                blurHash={thumbnail.blurHash}
                width={350}
                height={420}
                objectFit="cover"
                layout="responsive"
              />
            </figure>
          )}
          {!thumbnail && (
            <figure className={`${styles.ThumbnailPlaceholder} transition duration-300 ease-out bg-gray-200 dark:bg-gray-600`}>
              <BsImage />
            </figure>
          )}
        </a>
      </Link>

      <div className={styles.Inner}>
        <div className={styles.Info}>
          <Link href={category.url} passHref>
            <a className={styles.Category}>{category.name}</a>
          </Link>
          <div className={styles.Date}>{createdAt}</div>
          <div className={styles.Excerpt}>{excerpt}</div>
          <Link href={url} passHref>
            <a className={styles.More}>Читать дальше</a>
          </Link>
        </div>
        <div className={styles.Name}>{name}</div>
      </div>
    </div>
  )
}
