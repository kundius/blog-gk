import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetArticleArgs {
  alias: string
}

export interface GetArticleData {
  data: {
    id: string
    alias: string
    name: string
    content: string
    date_created: string
    date_updated: string
    portion_count?: string
    cooking_time?: string
    excerpt?: string
    comments_count: number | null
    hits_count: number | null
    likes_count: number | null
    seo_title: string
    seo_keywords: string
    seo_description: string
    ingredients?: {
      name: string
      value: string
    }[]
    tags?: {
      tag: {
        name: string
        alias: string
      }
    }[]
    category: {
      name: string
      alias: string
      section: {
        name: string
        alias: string
      }
    }
    thumbnail?: {
      filename_disk: string
      title: string
      blurhash: string
      width: number
      height: number
    }
  } | undefined
}

export type GetArticleResult = [string, (url: string) => Promise<GetArticleData>]

export function getArticle ({
  alias
}: GetArticleArgs): GetArticleResult {
  const params = queryString.stringify({
    'filter[alias][_eq]': alias,
    fields: 'id,alias,content,name,date_created,date_updated,portion_count,cooking_time,excerpt,ingredients,comments_count,likes_count,hits_count,seo_title,seo_keywords,seo_description,category.name,category.alias,category.section.alias,category.section.name,thumbnail.filename_disk,thumbnail.title,thumbnail.width,thumbnail.height,thumbnail.blurhash,tags.tag.name,tags.tag.alias'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url).then(r => ({ data: r?.data?.[0] }))
  return [key, fetcher]
}

export interface GetPreviousArgs {
  id: string
  date: string
}

export interface GetPreviousData {
  data: {
    alias: string
    name: string
    category: {
      alias: string
      section: {
        alias: string
      }
    }
  } | undefined
}

export type GetPreviousResult = [string, (url: string) => Promise<GetPreviousData>]

export function getPrevious ({
  id,
  date
}: GetPreviousArgs): GetPreviousResult {
  const params = queryString.stringify({
    'filter[date_created][_lt]': date,
    'filter[id][_neq]': id,
    'sort': '-date_created',
    fields: 'alias,name,category.alias,category.section.alias'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url).then(r => ({ data: r?.data?.[0] }))
  return [key, fetcher]
}

export interface GetNextArgs {
  id: string
  date: string
}

export interface GetNextData {
  data: {
    alias: string
    name: string
    category: {
      alias: string
      section: {
        alias: string
      }
    }
  } | undefined
}

export type GetNextResult = [string, (url: string) => Promise<GetNextData>]

export function getNext ({
  id,
  date
}: GetNextArgs): GetNextResult {
  const params = queryString.stringify({
    'filter[date_created][_gt]': date,
    'filter[id][_neq]': id,
    'sort': 'date_created',
    fields: 'alias,name,category.alias,category.section.alias'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/articles?${params}`
  const fetcher = url => fetchJson(url).then(r => ({ data: r?.data?.[0] }))
  return [key, fetcher]
}
