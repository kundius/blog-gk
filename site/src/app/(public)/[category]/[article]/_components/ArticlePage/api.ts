import { articleByAlias, previousArticle, nextArticle } from '@app/api/articles'
import type { ArticleDetail } from '@app/api/types'

export interface GetArticleArgs {
  alias: string
}

export interface GetArticleData {
  data: ArticleDetail | null
}

export type GetArticleResult = [string, (url: string) => Promise<GetArticleData>]

export function getArticle ({ alias }: GetArticleArgs): GetArticleResult {
  return articleByAlias(alias) as GetArticleResult
}

export interface GetPreviousArgs {
  id: string
}

export interface GetNextArgs {
  id: string
}

export interface GetNeighborData {
  data: {
    id: string
    alias: string
    name: string
    category: {
      id: string
      name: string
      alias: string
    }
  } | null
}

export type GetPreviousResult = [string, (url: string) => Promise<GetNeighborData>]
export type GetNextResult = [string, (url: string) => Promise<GetNeighborData>]

export type GetPreviousData = GetNeighborData
export type GetNextData = GetNeighborData

export function getPrevious ({ id }: GetPreviousArgs): GetPreviousResult {
  return previousArticle(id) as GetPreviousResult
}

export function getNext ({ id }: GetNextArgs): GetNextResult {
  return nextArticle(id) as GetNextResult
}
