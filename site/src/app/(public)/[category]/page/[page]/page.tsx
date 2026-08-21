import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CategoryPage } from '../../_components/CategoryPage'
import { CATEGORY_PAGE_SIZE } from '../../_components/CategoryPage/api'
import { categoryByAlias } from '@app/api/categories'
import { listArticles } from '@app/api/articles'
import { CLIENT_URL } from '@app/utils/config'

import { SWRPreload } from '../../../../swr-preload'

export const revalidate = 900
export const dynamicParams = true

export interface CategoryPageRouteParams {
  category: string
  page: string
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null
  const page = Number.parseInt(raw, 10)
  return Number.isSafeInteger(page) && page >= 1 ? page : null
}

export async function generateMetadata({
  params
}: {
  params: Promise<CategoryPageRouteParams>
}): Promise<Metadata> {
  const { category, page: rawPage } = await params
  const page = parsePage(rawPage)

  if (!page || page === 1) {
    return {}
  }

  const [categoryKey, categoryFetcher] = categoryByAlias(category)
  const result = await categoryFetcher(categoryKey)

  if (!result?.data) {
    return {}
  }

  const { data } = result

  return {
    title: `${data.seoTitle || data.name} — Страница ${page}`,
    description: data.seoDescription || undefined,
    alternates: {
      canonical: `${CLIENT_URL}/${data.alias}/page/${page}`
    }
  }
}

export default async function CategoryPageRoute({
  params
}: {
  params: Promise<CategoryPageRouteParams>
}) {
  const { category, page: rawPage } = await params
  const page = parsePage(rawPage)

  if (!page) {
    notFound()
  }

  if (page === 1) {
    redirect(`/${category}`)
  }

  const [categoryKey, categoryFetcher] = categoryByAlias(category)
  const [articlesKey, articlesFetcher] = listArticles({
    categories: [category],
    limit: CATEGORY_PAGE_SIZE,
    page
  })

  const preloadData = {
    [categoryKey]: await categoryFetcher(categoryKey),
    [articlesKey]: await articlesFetcher(articlesKey)
  }

  if (!preloadData[categoryKey]?.data) {
    notFound()
  }

  const meta = preloadData[articlesKey]?.meta
  const totalPages = Math.max(
    1,
    Math.ceil((meta?.total ?? 0) / CATEGORY_PAGE_SIZE)
  )

  if (page > totalPages) {
    notFound()
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <CategoryPage alias={category} page={page} />
    </SWRPreload>
  )
}
