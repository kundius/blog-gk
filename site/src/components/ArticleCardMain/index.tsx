import React from 'react'
import Link from 'next/link'

import { Image } from '@components/Image'
import { ClocheIcon } from '@components/Icon/cloche'
import { ToqueIcon } from '@components/Icon/toque'
import { EyeIcon } from '@components/Icon/eye'
import { HeartIcon } from '@components/Icon/heart'
import { CommentsIcon } from '@components/Icon/comments'
import { ArticleLikes } from '@components/ArticleLikes'

import * as styles from './styles.module.css'

export interface ArticleCardMainProps {
  id: string
  name: string
  url: string
  createdAt: string
  portionCount?: string
  cookingTime?: string
  commentsCount: number
  hitsCount: number
  likesCount: number
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

export function ArticleCardMain({
  id,
  name,
  url,
  category,
  createdAt,
  portionCount,
  cookingTime,
  commentsCount,
  hitsCount,
  likesCount,
  thumbnail,
  excerpt
}: ArticleCardMainProps) {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Meta}>
        <Link href={category.url} passHref>
          <a className={styles.Category}>{category.name}</a>
        </Link>
        <div className={styles.Date}>{createdAt}</div>
      </div>
      <div className={styles.Name}>
        <Link href={url} passHref>
          <a>{name}</a>
        </Link>
      </div>
      <div
        className={`${styles.Info} flex items-center justify-between border-b border-gray-200 dark:border-gray-600 gap-4 md:gap-8 flex-col md:flex-row`}
      >
        {(cookingTime || portionCount) && (
          <div className="flex items-center gap-8">
            {cookingTime && (
              <div className="flex items-center gap-2">
                <div className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                  <ToqueIcon />
                </div>
                <div className="text-xs uppercase">{cookingTime}</div>
              </div>
            )}
            {portionCount && (
              <div className="flex items-center gap-2">
                <div className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                  <ClocheIcon />
                </div>
                <div className="text-xs uppercase">{portionCount}</div>
              </div>
            )}
          </div>
        )}
        <div className="hidden md:block" />
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <span className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                <EyeIcon />
              </span>
              <span className="text-xs uppercase">{hitsCount}</span>
            </span>
          </span>
          <Link href={`${url}#comments`} passHref>
            <a className="flex items-center gap-8">
              <span className="flex items-center gap-2">
                <span className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                  <CommentsIcon />
                </span>
                <span className="text-xs uppercase">{commentsCount}</span>
              </span>
            </a>
          </Link>
          <ArticleLikes id={id} />
        </div>
      </div>
      {thumbnail && (
        <Link href={url}>
          <figure className={styles.Thumbnail}>
            <Image
              src={thumbnail.url}
              alt={thumbnail.name}
              blurHash={thumbnail.blurHash}
              width={640}
              height={480}
              objectFit="cover"
              layout="responsive"
            />
          </figure>
        </Link>
      )}
      {excerpt && <div className={styles.Excerpt}>{excerpt}</div>}
      <Link href={url} passHref>
        <a className={styles.More}>Читать дальше</a>
      </Link>
    </div>
  )
}
