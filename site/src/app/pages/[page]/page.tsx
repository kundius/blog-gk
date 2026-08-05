import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentPage } from '@components/ContentPage'
import { pageByAlias, listPages } from '@app/api/pages'

import { SWRPreload } from '../../swr-preload'

export const revalidate = 900
export const dynamicParams = true

export interface PageRouteParams {
  page: string
}

export async function generateStaticParams () {
  const [key, fetcher] = listPages({ limit: 1000 })
  const result = await fetcher(key)
  return (result.data || []).map((page: { alias: string }) => ({
    page: page.alias
  }))
}

export async function generateMetadata ({ params }: { params: Promise<PageRouteParams> }): Promise<Metadata> {
  const { page } = await params
  const [pageKey, pageFetcher] = pageByAlias(page)
  const result = await pageFetcher(pageKey)

  if (!result?.data) {
    return {}
  }

  const { data } = result

  return {
    title: data.seoTitle || data.name,
    description: data.seoDescription || undefined,
    keywords: data.seoKeywords || undefined
  }
}

export default async function PageRoute ({ params }: { params: Promise<PageRouteParams> }) {
  const { page } = await params

  const preloadData: Record<string, unknown> = {}

  const [pageKey, pageFetcher] = pageByAlias(page)
  const pageData = await pageFetcher(pageKey)

  if (!pageData.data) {
    notFound()
  }

  preloadData[pageKey] = pageData

  return (
    <SWRPreload preloadData={preloadData}>
      <ContentPage alias={page} />
    </SWRPreload>
  )
}
