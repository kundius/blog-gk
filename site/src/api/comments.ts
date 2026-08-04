import queryString from 'query-string'
import { fetchJson } from '@app/utils/fetchJson'
import { getApiUrl, postJson } from './http'

export type Fetcher<T> = (url: string) => Promise<T>
export type KeyedFetcher<T> = [string, Fetcher<T>]

export interface ListCommentsArgs {
  articleId?: string
  status?: string
  page?: number
  limit?: number
  sort?: string
}

export function listComments(args: ListCommentsArgs = {}): KeyedFetcher<any> {
  const params = queryString.stringify({
    sort: args.sort || '-dateCreated',
    articleId: args.articleId,
    status: args.status,
    page: args.page,
    limit: args.limit
  })
  const key = `${getApiUrl()}/api/comments?${params}`
  return [key, (url) => fetchJson(url)]
}

export interface CreateCommentArgs {
  articleId?: string
  parentId?: string
  content: string
  authorName?: string
  authorEmail?: string
}

export async function createComment(args: CreateCommentArgs): Promise<any> {
  return postJson(`${getApiUrl()}/api/comments`, {
    articleId: args.articleId,
    parentId: args.parentId,
    content: args.content,
    authorName: args.authorName,
    authorEmail: args.authorEmail
  })
}
