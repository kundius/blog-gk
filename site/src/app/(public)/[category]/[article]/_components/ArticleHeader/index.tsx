'use client'
import React from 'react'

import { CLIENT_URL } from '@app/utils/config'
import { fileUrl } from '@app/api/images'
import { CoverImage } from '@components/CoverImage'
import { useLightboxOpen } from '@components/Lightbox'
import type { ArticleDetail } from '@app/api/types'

import { ArticleBreadcrumbs } from './Breadcrumbs'
import { ArticleMeta } from './Meta'
import * as styles from './styles.module.css'

export interface ArticleHeaderProps {
  data: ArticleDetail
}

export function ArticleHeader({ data }: ArticleHeaderProps) {
  const pageUrl = `${CLIENT_URL}/${data.category.alias}/${data.alias}`
  const isRecipe = !!data.ingredients
  const thumbnail = data.thumbnail
  const thumbnailUrl = fileUrl(thumbnail)
  const onOpen = useLightboxOpen()

  return (
    <>
      <header className={`${styles.header} hero-surface py-5 px-6 md:py-7 md:px-8 lg:py-10 lg:px-12`}>
        <div className={styles.content}>
          <ArticleBreadcrumbs category={data.category} />

          <h1 className={styles.title} itemProp="headline name">
            {data.name}
          </h1>

          <ArticleMeta
            id={data.id}
            isRecipe={isRecipe}
            cookingTime={data.cookingTime}
            portionCount={data.portionCount}
            dateCreated={data.dateCreated}
            hitsCount={data.hitsCount}
            commentsCount={data.commentsCount}
            likesCount={data.likesCount}
          />
        </div>

        {thumbnail && thumbnailUrl && (
          <div className={styles.imageWrapper}>
            <div
              className={styles.image}
              itemScope
              itemProp={isRecipe ? 'image resultPhoto' : 'image'}
              itemType="http://schema.org/ImageObject"
            >
              <CoverImage
                src={thumbnailUrl}
                alt={thumbnail.title || data.name}
                blurHash={thumbnail.blurhash}
                sizes="264px"
                loading="lazy"
                itemProp="url contentUrl"
                onClick={onOpen}
                className="cursor-zoom-in"
              />
              <meta itemProp="width" content={String(thumbnail.width || 1)} />
              <meta itemProp="height" content={String(thumbnail.height || 1)} />
            </div>
          </div>
        )}

        <div className="hidden">
          <span itemProp="author">Галина Кундиус</span>
          <meta
            itemProp="description"
            content={data.excerpt || data.seoDescription || ''}
          />
          <div
            itemProp="publisher"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <div
              itemProp="logo"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              <img itemProp="url image" src="/images/logo.png" />
              <meta itemProp="width" content="118" />
              <meta itemProp="height" content="118" />
            </div>
            <meta itemProp="name" content="Блог Галины Кундиус" />
            <meta itemProp="telephone" content="+7 961 028 0539" />
            <meta itemProp="address" content="г. Воронеж" />
          </div>
          <meta
            itemProp="dateModified"
            content={data.dateUpdated || undefined}
          />
          <time itemProp="datePublished" dateTime={data.dateCreated}>
            {data.dateCreated}
          </time>
          <meta
            itemScope
            itemProp="mainEntityOfPage"
            itemType="https://schema.org/WebPage"
            itemID={pageUrl}
          />
        </div>
      </header>
    </>
  )
}
