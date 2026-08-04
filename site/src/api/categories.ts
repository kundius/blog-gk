import queryString from 'query-string'
import { fetchJson } from '@app/utils/fetchJson'
import { getApiUrl, fetchDetail } from './http'

export type Fetcher<T> = (url: string) => Promise<T>
export type KeyedFetcher<T> = [string, Fetcher<T>]

export interface ListCategoriesArgs {
  page?: number
  limit?: number
  sort?: string
}

export function listCategories(args: ListCategoriesArgs = {}): KeyedFetcher<any> {
  const params = queryString.stringify({
    sort: args.sort || 'name',
    page: args.page,
    limit: args.limit
  })
  const key = `${getApiUrl()}/api/categories?${params}`
  return [key, (url) => fetchJson(url)]
}

export function categoriesTree(): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/categories/tree`
  return [key, (url) => fetchJson(url)]
}

export function categoryByAlias(alias: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/categories/by-alias/${encodeURIComponent(alias)}`
  return [key, (url) => fetchDetail(url)]
}
