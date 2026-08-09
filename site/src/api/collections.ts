import queryString from 'query-string'
import { fetchJson } from '@app/utils/fetchJson'
import { getApiUrl, fetchDetail } from './http'

export type Fetcher<T> = (url: string) => Promise<T>
export type KeyedFetcher<T> = [string, Fetcher<T>]

export interface ListCollectionsArgs {
  page?: number
  limit?: number
  sort?: string
  featured?: boolean
}

export function listCollections(args: ListCollectionsArgs = {}): KeyedFetcher<any> {
  const params = queryString.stringify({
    sort: args.sort || 'name',
    page: args.page,
    limit: args.limit,
    featured: args.featured === undefined ? undefined : String(args.featured)
  })
  const key = `${getApiUrl()}/api/collections?${params}`
  return [key, (url) => fetchJson(url)]
}

export function collectionByAlias(alias: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/collections/by-alias/${encodeURIComponent(alias)}`
  return [key, (url) => fetchDetail(url)]
}
