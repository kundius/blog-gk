'use client'
import React from 'react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import { ArticleCardMain } from '@components/ArticleCardMain'
import { fileUrl } from '@app/api/images'
import { MainLayout } from '@components/MainLayout'
import { Container } from '@components/Container'

import * as api from './api'

interface CollectionPageProps {
  alias: string
}

export function CollectionPage({ alias }: CollectionPageProps) {
  const [key, fetcher] = api.getCollection({
    alias
  })

  const { data: result } = useSWR<api.GetCollectionData>(key, fetcher)

  const articles =
    result?.data?.articles
      ?.map((item) => item.article)
      .filter((article) => !!article) || []

  return (
    <Container className="mt-20 mb-20">
      <MainLayout>
        <h1 className="mb-4">{result?.data?.name}</h1>
        {result?.data?.description && (
          <p className="mb-12 text-lg text-gray-600 dark:text-gray-300">
            {result.data.description}
          </p>
        )}

      {(articles?.length || 0) === 0 && (
        <div className="text-center text-xl">
          В этой подборке пока нет статей
        </div>
      )}

      <div className="grid gap-32">
        {articles?.map((article) => (
          <div key={article.id} className="max-w-2xl w-full mx-auto">
            <ArticleCardMain
              id={article.id}
              name={article.name}
              portionCount={article.portionCount || undefined}
              cookingTime={article.cookingTime || undefined}
              commentsCount={article.commentsCount || 0}
              hitsCount={article.hitsCount || 0}
              likesCount={article.likesCount || 0}
              excerpt={article.excerpt || undefined}
              createdAt={DateTime.fromISO(article.dateCreated)
                .setLocale('ru')
                .toFormat('DDD')
                .replace(' г.', '')}
              thumbnail={
                article.thumbnail
                  ? {
                      name: article.thumbnail?.title || undefined,
                      blurHash: article.thumbnail?.blurhash || undefined,
                      url: fileUrl(article.thumbnail?.filenameDisk)
                    }
                  : undefined
              }
              url={`/${article.category.alias}/${article.alias}`}
              category={{
                name: article.category.name,
                url: `/${article.category.alias}`
              }}
            />
          </div>
        ))}
      </div>
      </MainLayout>
    </Container>
  )
}
