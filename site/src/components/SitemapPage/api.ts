import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetArticlesArgs {
  sectionIn?: string[]
  sectionNotIn?: string[]
  categoryIn?: string[]
  categoryNotIn?: string[]
}

export interface GetArticlesData {
  data: {
    id: string
    alias: string
    name: string
    category: {
      alias: string
      section: {
        alias: string
      }
    }
  }[]
}

export type GetArticlesResult = [string, (url: string) => Promise<GetArticlesData>]

export function getArticles ({
  sectionIn,
  sectionNotIn,
  categoryIn,
  categoryNotIn
}: GetArticlesArgs): GetArticlesResult {
  const params = queryString.stringify({
    'filter[category][section][alias][_in]': sectionIn,
    'filter[category][section][alias][_nin]': sectionNotIn,
    'filter[category][alias][_in]': categoryIn,
    'filter[category][alias][_nin]': categoryNotIn,
    fields: 'id,alias,name,category.alias,category.section.alias'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
