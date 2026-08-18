'use client'
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useQueryState, parseAsInteger } from 'nuqs'

import { Pagination } from '@components/Pagination'
import { RecipeCard } from '@components/RecipeCard'
import { Container } from '@components/Container'
import { CoverImage } from '@components/CoverImage'
import { Spinner } from '@components/Spinner'
import { fileUrl } from '@app/api/images'
import { useScrollOnPageChange } from '@app/lib/hooks/useScrollOnPageChange'
import { breadcrumbCategories } from '@app/lib/breadcrumbs'
import type { ArticleListItem } from '@app/api/types'

import * as api from './api'

interface CategoryPageProps {
  alias: string
}

export function CategoryPage({ alias }: CategoryPageProps) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const limit = 12

  const [keyCategory, fetcherCategory] = api.getCategory({ alias })
  const { data: categoryResult } = useSWR<api.GetCategoryData>(
    keyCategory,
    fetcherCategory
  )

  const [keyArticles, fetcherArticles] = api.getArticles({ alias, limit, page })
  const { data: articlesResult, isValidating } = useSWR<api.GetArticlesData>(
    keyArticles,
    fetcherArticles,
    { keepPreviousData: true }
  )

  const category = categoryResult?.data
  const children =
    category?.children?.filter((child) => child !== undefined) ?? []
  const articles = articlesResult?.data ?? []
  const total = articlesResult?.meta?.total ?? 0
  const loaded = articlesResult !== undefined
  const hasContent = (articlesResult?.data?.length ?? 0) > 0

  const didMount = useRef(false)
  const prevPageRef = useRef(page)
  const [hasNavigated, setHasNavigated] = useState(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      prevPageRef.current = page
      return
    }
    if (prevPageRef.current !== page) {
      prevPageRef.current = page
      setHasNavigated(true)
    }
  }, [page])

  const loadingTransition = hasNavigated && isValidating && loaded

  const listRef = useScrollOnPageChange({ page, loaded, hasContent })

  return (
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <div className="flex flex-col gap-12 md:gap-16">
        {category && (
          <header className="hero-surface rounded-[24px] py-5 px-6 md:py-7 md:px-8 lg:py-10 lg:px-12">
            <nav
              className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-400 dark:text-stone-400"
              itemScope
              itemType="http://schema.org/BreadcrumbList"
            >
              <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
              >
                <Link
                  href="/"
                  itemProp="item"
                  className="transition-colors hover:text-[#d36d6d]"
                >
                  <span itemProp="name">Главная</span>
                </Link>
                <meta itemProp="position" content="1" />
              </span>
              {breadcrumbCategories(category).map((item, index) => (
                <React.Fragment key={item.alias}>
                  <span className="text-gray-300 dark:text-stone-600">/</span>
                  <span
                    itemProp="itemListElement"
                    itemScope
                    itemType="http://schema.org/ListItem"
                  >
                    {item.isCurrent ? (
                      <span
                        itemProp="name"
                        className="text-gray-600 dark:text-stone-200"
                      >
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={`/${item.alias}`}
                        itemProp="item"
                        className="transition-colors hover:text-[#d36d6d]"
                      >
                        <span itemProp="name">{item.name}</span>
                      </Link>
                    )}
                    <meta itemProp="position" content={String(index + 2)} />
                  </span>
                </React.Fragment>
              ))}
            </nav>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl dark:text-stone-100">
              {category.name}
            </h1>

            {category.content && (
              <p className="mt-5 max-w-[750px] text-base leading-relaxed text-stone-500 dark:text-stone-400 md:text-lg">
                {category.content}
              </p>
            )}
          </header>
        )}

        {children.length > 0 && (
          <section className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/${child.alias}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:[transform:scale(1.06)]">
                    {child.thumbnail ? (
                      <CoverImage
                        src={fileUrl(child.thumbnail) ?? ''}
                        alt={child.thumbnail.title || child.name}
                        blurHash={child.thumbnail.blurhash}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 from-20% to-transparent to-70% opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                </div>
                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                  <h3 className="text-lg font-semibold leading-tight text-white sm:text-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
                    {child.name}
                  </h3>
                  {child.content && (
                    <p className="hidden max-h-0 translate-y-1.5 overflow-hidden text-sm leading-snug text-white opacity-0 transition-all duration-300 group-hover:mt-1.5 group-hover:max-h-[60px] group-hover:translate-y-0 group-hover:opacity-100 sm:block sm:text-base [text-shadow:0_1px_5px_rgba(0,0,0,0.3)]">
                      {child.content}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}

        {total > 0 && (
          <section
            ref={listRef}
            style={{ scrollMarginTop: 96 }}
            className="relative flex flex-col gap-10"
          >
            {loadingTransition && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Spinner className="h-60 w-60 text-[#d36d6d]" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {articles.map((article) => (
                <RecipeCard key={article.id} article={article} />
              ))}
            </div>

            {total > limit && (
              <Pagination
                current={page}
                total={total}
                pageSize={limit}
                onChange={(p) => void setPage(p)}
              />
            )}
          </section>
        )}
      </div>
    </Container>
  )
}
