'use client'
import React, { useState, useContext, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import { Pagination } from '@components/Pagination'
import { ArticleCardMain } from '@components/ArticleCardMain'
import { fileUrl } from '@app/api/images'
import { MainLayout } from '@components/MainLayout'
import { Container } from '@components/Container'

import * as api from './api'

interface CategoryPageProps {
  alias: string
}

export function CategoryPage({ alias }: CategoryPageProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  useEffect(() => {
    if (mounted) {
      scrollToList()
    }
    setMounted(true)
  }, [page])

  useEffect(() => {
    setPage(1)
  }, [alias])

  const [keyCategory, fetcherCategory] = api.getCategory({
    alias
  })

  const { data: categoryResult } = useSWR<api.GetCategoryData>(
    keyCategory,
    fetcherCategory
  )

  const [keyArticles, fetcherArticles] = api.getArticles({
    alias,
    limit,
    page
  })

  const { data: articlesResult } = useSWR<api.GetArticlesData>(
    keyArticles,
    fetcherArticles
  )

  function scrollToList() {
    if (listRef.current) {
      listRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }

  return (
    <Container className="mt-20 mb-20">
      <MainLayout>
        <div
          className="grid gap-32"
          ref={listRef}
          style={{
            scrollMarginTop: 80
          }}
        >
        {(articlesResult?.data?.length || 0) === 0 && (
          <div className="text-center text-xl">
            Записи в данном разделе отсутствуют
          </div>
        )}

        {articlesResult?.data?.map((article) => (
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

        {(articlesResult?.meta?.total || 0) > limit && (
          <Pagination
            current={page}
            total={articlesResult?.meta?.total}
            pageSize={limit}
            onChange={setPage}
          />
        )}
      </div>
      </MainLayout>
    </Container>
  )
}
