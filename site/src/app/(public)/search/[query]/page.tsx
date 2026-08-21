import { Metadata } from 'next'
import { SearchPage } from '../_components/SearchPage'
import { searchArticles } from '@app/api/articles'
import { CLIENT_URL } from '@app/utils/config'

import { SWRPreload } from '../../../swr-preload'

export const revalidate = 900
export const dynamicParams = true

export interface SearchRouteParams {
  query: string
}

export async function generateMetadata ({ params }: { params: Promise<SearchRouteParams> }): Promise<Metadata> {
  const { query } = await params
  const decoded = decodeURIComponent(query)

  return {
    title: `Поиск «${decoded || '...'}»`,
    robots: { index: false },
    alternates: {
      canonical: `${CLIENT_URL}/search/${decoded}`
    }
  }
}

export default async function SearchRoute ({ params }: { params: Promise<SearchRouteParams> }) {
  const { query } = await params
  const decoded = decodeURIComponent(query)

  const preloadData: Record<string, unknown> = {}

  const [pageKey, pageFetcher] = searchArticles(String(decoded), 20)
  preloadData[pageKey] = await pageFetcher(pageKey)

  return (
    <SWRPreload preloadData={preloadData}>
      <SearchPage query={decoded} />
    </SWRPreload>
  )
}
