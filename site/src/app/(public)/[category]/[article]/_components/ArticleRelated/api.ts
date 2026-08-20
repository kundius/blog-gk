import { relatedArticles } from '@app/api/articles'
import type { ArticleListItem } from '@app/api/types'

export interface GetRelatedArgs {
  id: string
  limit: number
}

export interface GetRelatedData {
  data: ArticleListItem[]
}

export type GetRelatedResult = [string, (url: string) => Promise<GetRelatedData>]

export function getRelated ({ id, limit }: GetRelatedArgs): GetRelatedResult {
  return relatedArticles(id, limit) as GetRelatedResult
}
