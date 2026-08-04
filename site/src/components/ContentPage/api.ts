import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetPageArgs {
  alias: string
}

export interface GetPageData {
  data: {
    id: string
    alias: string
    name: string
    content: string
    seo_title: string
    seo_keywords: string
    seo_description: string
  }
}

export type GetPageResult = [string, (url: string) => Promise<GetPageData>]

export function getPage ({
  alias
}: GetPageArgs): GetPageResult {
  const params = queryString.stringify({
    'filter[alias][_eq]': alias,
    fields: 'id,alias,content,name,seo_title,seo_keywords,seo_description'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/pages?${params}`
  const fetcher = url => fetchJson(url).then(r => ({ data: r?.data?.[0] }))
  return [key, fetcher]
}
