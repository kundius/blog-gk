import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPage } from '@components/CategoryPage'
import { categoryByAlias, listCategories } from '@app/api/categories'
import { listArticles } from '@app/api/articles'
import { CLIENT_URL } from '@app/utils/config'

import { SWRPreload } from '../../swr-preload'

export const revalidate = 900
export const dynamicParams = true

export interface CategoryPageParams {
  category: string
}

export async function generateStaticParams () {
  const [key, fetcher] = listCategories({ limit: 1000 })
  const result = await fetcher(key)
  return (result.data || []).map((category: { alias: string }) => ({
    category: category.alias
  }))
}

export async function generateMetadata ({ params }: { params: Promise<CategoryPageParams> }): Promise<Metadata> {
  const { category } = await params
  const [categoryKey, categoryFetcher] = categoryByAlias(category)
  const result = await categoryFetcher(categoryKey)

  if (!result?.data) {
    return {}
  }

  const { data } = result

  return {
    title: data.seoTitle || data.name,
    description: data.seoDescription || undefined,
    keywords: data.seoKeywords || undefined,
    alternates: {
      canonical: `${CLIENT_URL}/${data.alias}`
    }
  }
}

export default async function CategoryRoute ({ params }: { params: Promise<CategoryPageParams> }) {
  const { category } = await params

  const [categoryKey, categoryFetcher] = categoryByAlias(category)
  const [articlesKey, articlesFetcher] = listArticles({
    categories: [category],
    limit: 12,
    page: 1
  })

  const preloadData = {
    [categoryKey]: await categoryFetcher(categoryKey),
    [articlesKey]: await articlesFetcher(articlesKey)
  }

  if (!preloadData[categoryKey]?.data) {
    notFound()
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <CategoryPage alias={category} />
    </SWRPreload>
  )
}
