import { listArticles } from '@app/api/articles'
import type { ArticleListItem } from '@app/api/types'

export interface GetArticlesArgs {
  limit: number
}

export interface GetArticlesData {
  data: ArticleListItem[]
}

export type GetArticlesResult = [string, (url: string) => Promise<GetArticlesData>]

export function getArticles ({ limit }: GetArticlesArgs): GetArticlesResult {
  return listArticles({ limit }) as GetArticlesResult
}
