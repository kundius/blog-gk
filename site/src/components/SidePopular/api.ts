import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetArticlesArgs {
  limit: number
}

export interface GetArticlesData {
  data: {
    alias: string
    name: string
    date_created: string
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
  limit
}: GetArticlesArgs): GetArticlesResult {
  const params = queryString.stringify({
    sort: '-hits_count',
    'filter[hits_count][_neq]': 'null',
    fields: 'alias,name,date_created,category.name,category.alias,category.section.alias,thumbnail.filename_disk,thumbnail.title,thumbnail.blurhash',
    limit
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
