import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetRelatedArgs {
  id: string
  limit: number
}

export interface GetRelatedData {
  data: {
    alias: string
    name: string
    date_created: string
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

export type GetRelatedResult = [string, (url: string) => Promise<GetRelatedData>]

export function getRelated ({
  id,
  limit
}: GetRelatedArgs): GetRelatedResult {
  const params = queryString.stringify({
    fields: 'alias,name,date_created,excerpt,category.name,category.alias,category.section.alias,thumbnail.filename_disk,thumbnail.title,thumbnail.blurhash',
    limit
  })
  const key = `${publicRuntimeConfig.API_URL}/custom/articles/${id}/related?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
