'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { CategoryPagination } from '@components/CategoryPagination'
import { RecipeCard } from '@components/RecipeCard'
import { Container } from '@components/Container'
import { CoverImage } from '@components/CoverImage'
import { CategoryCollage } from '@components/CategoryCollage'
import { ChefHat } from 'lucide-react'
import { pluralRecipes } from '@app/lib/plural'
import { fileUrl } from '@app/api/images'
import { breadcrumbCategories } from '@app/lib/breadcrumbs'
import type { ArticleListItem } from '@app/api/types'

import * as api from './api'

interface CategoryPageProps {
  alias: string
  page: number
}

export function CategoryPage({ alias, page }: CategoryPageProps) {
  const limit = api.CATEGORY_PAGE_SIZE

  const [keyCategory, fetcherCategory] = api.getCategory({ alias })
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

  const category = categoryResult?.data
  const children =
    category?.children?.filter((child) => child !== undefined) ?? []
  const articles = articlesResult?.data ?? []
  const total = articlesResult?.meta?.total ?? 0

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
              {page > 1 ? `${category.name} — страница ${page}` : category.name}
            </h1>

            {category.content && page === 1 && (
              <p className="mt-5 max-w-[750px] text-base leading-relaxed text-stone-500 dark:text-stone-400 md:text-lg">
                {category.content}
              </p>
            )}
          </header>
        )}

        {children.length > 0 && page === 1 && (
          <section className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {children.map((child, index) => (
              <Link
                key={child.id}
                href={`/${child.alias}`}
                className="group relative aspect-[4/3] rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
              >
                <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform">
                  <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                    {child.thumbnail ? (
                      <CoverImage
                        src={fileUrl(child.thumbnail) ?? ''}
                        alt={child.thumbnail.title || child.name}
                        blurHash={child.thumbnail.blurhash}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : child.collageThumbnails?.length ? (
                      <CategoryCollage
                        files={child.collageThumbnails}
                        variant={index}
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 from-20% to-transparent to-70% opacity-80 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition-opacity duration-300 group-hover:opacity-95 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />
                  </div>
                </div>
                {(child._count?.articleCategories ?? 0) > 0 && (
                  <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-md sm:px-3 sm:py-1.5 sm:text-sm"
                      style={{ backgroundColor: 'var(--main-color)' }}
                    >
                      <ChefHat size="1.2em" strokeWidth={2} />
                      {child._count?.articleCategories ?? 0}
                      <span className="hidden sm:inline">
                        {pluralRecipes(child._count?.articleCategories ?? 0)}
                      </span>
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                  <h3 className="text-lg font-semibold leading-tight text-white sm:text-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
                    {child.name}
                  </h3>
                  {child.content && (
                    <p className="hidden max-h-[26px] min-h-[26px] translate-y-1.5 overflow-hidden text-sm leading-snug text-white opacity-0 transition-all duration-300 group-hover:max-h-[70px] group-hover:min-h-[46px] group-hover:translate-y-0 group-hover:pt-1.5 group-hover:opacity-100 sm:block sm:text-base [text-shadow:0_1px_5px_rgba(0,0,0,0.3)]">
                      {child.content}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}

        {total > 0 && (
          <section className="flex flex-col gap-10">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {articles.map((article) => (
                <RecipeCard key={article.id} article={article} />
              ))}
            </div>

            <CategoryPagination
              alias={alias}
              current={page}
              total={total}
              pageSize={limit}
            />
          </section>
        )}
      </div>
    </Container>
  )
}
