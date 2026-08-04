import queryString from 'query-string'
import { fetchJson } from '@app/utils/fetchJson'
import { getApiUrl, fetchDetail } from './http'

export type Fetcher<T> = (url: string) => Promise<T>
export type KeyedFetcher<T> = [string, Fetcher<T>]

export interface ListPagesArgs {
  page?: number
  limit?: number
}

export function listPages(args: ListPagesArgs = {}): KeyedFetcher<any> {
  const params = queryString.stringify({
    page: args.page,
    limit: args.limit
  })
  const key = `${getApiUrl()}/api/pages?${params}`
  return [key, (url) => fetchJson(url)]
}

export function pageByAlias(alias: string): KeyedFetcher<any> {
  const key = `${getApiUrl()}/api/pages/by-alias/${encodeURIComponent(alias)}`
  return [key, (url) => fetchDetail(url)]
}
