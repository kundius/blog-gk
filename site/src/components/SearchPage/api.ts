import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface SearchArgs {
  search: string
  limit: number
  page: number
}

export interface SearchData {
  meta: {
    search_count: number
  }
  data: {
    id: string
  }[]
}

export type SearchResult = [string, (url: string) => Promise<SearchData>]

export function Search ({
  search,
  limit,
  page
}: SearchArgs): SearchResult {
  const params = queryString.stringify({
    search,
    limit,
    page
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}

export interface GetArticleArgs {
  id: string
}

export interface GetArticleData {
  data: {
    alias: string
    name: string
    date_created: string
    portion_count?: string
    cooking_time?: string
    comments_count: number | null
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
  }
}

export type GetArticleResult = [string, (url: string) => Promise<GetArticleData>]

export function GetArticle ({
  id
}: GetArticleArgs): GetArticleResult {
  const params = queryString.stringify({
    fields: 'alias,name,date_created,portion_count,cooking_time,excerpt,comments_count,category.name,category.alias,category.section.alias,thumbnail.filename_disk,thumbnail.title,thumbnail.blurhash'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles/${id}?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
