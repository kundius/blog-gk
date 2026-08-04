import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetCommentsArgs {
  threadId: string
  threadType: string
}

export interface GetCommentsParent {
  id: string
  status: string
  date_created: string
  date_updated: string
  content?: string
  raw?: string
  author_name?: string
}

export interface GetCommentsItem {
  id: string
  status: string
  date_created: string
  date_updated: string
  content?: string
  raw?: string
  author_name?: string
  parent?: GetCommentsParent
}

export interface GetCommentsData {
  data: GetCommentsItem[]
}

export type GetCommentsResult = [string, (url: string) => Promise<GetCommentsData>]

export function getComments ({
  threadId,
  threadType
}: GetCommentsArgs): GetCommentsResult {
  const params = queryString.stringify({
    limit: -1,
    sort: '-date_created',
    fields: 'id,status,date_created,date_updated,content,raw,author_name,parent.id,parent.status,parent.date_created,parent.date_updated,parent.content,parent.author_name,parent.raw',
    'filter[thread][collection][_eq]': threadType,
    'filter[thread][item][_eq]': threadId
  })
  const key = `${publicRuntimeConfig.API_URL}/items/comments/?${params}`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
