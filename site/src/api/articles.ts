import queryString from 'query-string'
import { fetchJson } from '@app/utils/fetchJson'
import { getApiUrl, fetchDetail } from './http'

export type Fetcher<T> = (url: string) => Promise<T>
export type KeyedFetcher<T> = [string, Fetcher<T>]

export interface ListArticlesArgs {
  categories?: string[]
  categoriesNotIn?: string[]
  categoryAlias?: string
  status?: string
  page?: number
  limit?: number
  sort?: string
}

export function listArticles(args: ListArticlesArgs = {}): KeyedFetcher<any> {
  const params = queryString.stringify({
    sort: args.sort || '-dateCreated',
    categories: args.categories?.length ? args.categories.join(',') : undefined,
    categoriesNotIn: args.categoriesNotIn?.length
      ? args.categoriesNotIn.join(',')
      : undefined,
    categoryAlias: args.categoryAlias,
    status: args.status,
    page: args.page,
    limit: args.limit
  })
  const key = `${getApiUrl()}/api/articles?${params}`
  return [key, (url) => fetchJson(url)]
}

export function searchArticles(
  q: string,
  limit = 10,
  page = 1,
): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/articles/search?q=${encodeURIComponent(q)}&limit=${limit}&page=${page}`
  return [key, (url) => fetchJson(url)]
}

export function articleByAlias(alias: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/articles/by-alias/${encodeURIComponent(alias)}`
  return [key, (url) => fetchDetail(url)]
}

export function articleById(id: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/articles/${id}`
  return [key, (url) => fetchDetail(url)]
}

export function previousArticle(id: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/articles/${id}/prev`
  return [key, (url) => fetchDetail(url)]
}

export function nextArticle(id: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/articles/${id}/next`
  return [key, (url) => fetchDetail(url)]
}

export function relatedArticles(id: string, limit = 2): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/articles/${id}/related?limit=${limit}`
  return [key, (url) => fetchJson(url)]
}
