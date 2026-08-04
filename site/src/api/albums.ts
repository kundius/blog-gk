import queryString from 'query-string'
import { fetchJson } from '@app/utils/fetchJson'
import { getApiUrl, fetchDetail } from './http'

export type Fetcher<T> = (url: string) => Promise<T>
export type KeyedFetcher<T> = [string, Fetcher<T>]

export interface ListAlbumsArgs {
  page?: number
  limit?: number
  sort?: string
}

export function listAlbums(args: ListAlbumsArgs = {}): KeyedFetcher<any> {
  const params = queryString.stringify({
    sort: args.sort || 'name',
    page: args.page,
    limit: args.limit
  })
  const key = `${getApiUrl()}/api/albums?${params}`
  return [key, (url) => fetchJson(url)]
}

export function albumByAlias(alias: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/albums/by-alias/${encodeURIComponent(alias)}`
  return [key, (url) => fetchDetail(url)]
}
