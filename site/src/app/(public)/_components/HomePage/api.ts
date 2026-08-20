import { listArticles } from '@app/api/articles'
import type { ArticleListItem } from '@app/api/types'

export interface GetArticlesArgs {
  categories?: string[]
  categoriesNotIn?: string[]
  limit: number
}

export interface GetArticlesData {
  data: ArticleListItem[]
}

export type GetArticlesResult = [string, (url: string) => Promise<GetArticlesData>]

export function getArticles ({
  categories,
  categoriesNotIn,
  limit
}: GetArticlesArgs): GetArticlesResult {
  return listArticles({ categories, categoriesNotIn, limit }) as GetArticlesResult
}
