import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetArticlesArgs {
  aliasIn?: string[]
  aliasNotIn?: string[]
  limit: number
}

export interface GetArticlesData {
  data: {
    alias: string
    name: string
    date_created: string
    portion_count?: string
    cooking_time?: string
    comments_count: number | null
    hits_count: number | null
    excerpt?: string
    category: {
      name: string
      alias: string
      section: {
        alias: string
      }
    }
    thumbnail?: {
      filename_disk: string
      title: string
      blurhash: string
    }
  }[]
}

export type GetArticlesResult = [string, (url: string) => Promise<GetArticlesData>]

export function getArticles ({
  aliasIn,
  aliasNotIn,
  limit
}: GetArticlesArgs): GetArticlesResult {
  const params = queryString.stringify({
    sort: '-date_created',
    'filter[category][alias][_in]': aliasIn,
    'filter[category][alias][_nin]': aliasNotIn,
    fields: 'alias,name,date_created,portion_count,cooking_time,excerpt,comments_count,hits_count,category.name,category.alias,category.section.alias,thumbnail.filename_disk,thumbnail.title,thumbnail.blurhash',
    limit
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
