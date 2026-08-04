import { listArticles } from '@app/api/articles'
import { categoryByAlias } from '@app/api/categories'
import type { ArticleListItem, CategoryWithChildren } from '@app/api/types'

export interface GetArticlesArgs {
  alias: string
  page: number
  limit: number
}

export interface GetArticlesData {
  data: ArticleListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type GetArticlesResult = [string, (url: string) => Promise<GetArticlesData>]

export function getArticles ({
  alias,
  page,
  limit
}: GetArticlesArgs): GetArticlesResult {
  return listArticles({ categories: [alias], page, limit }) as GetArticlesResult
}

export interface GetCategoryArgs {
  alias: string
}

export interface GetCategoryData {
  data: CategoryWithChildren | null
}

export type GetCategoryResult = [string, (url: string) => Promise<GetCategoryData>]

export function getCategory ({ alias }: GetCategoryArgs): GetCategoryResult {
  return categoryByAlias(alias) as GetCategoryResult
}
