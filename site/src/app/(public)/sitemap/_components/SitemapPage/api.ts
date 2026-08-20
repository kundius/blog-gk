import { listArticles } from '@app/api/articles'
import { categoriesTree } from '@app/api/categories'
import type { ArticleListItem, CategoryWithChildren } from '@app/api/types'

export interface GetArticlesArgs {
  categories?: string[]
  categoriesNotIn?: string[]
}

export interface GetArticlesData {
  data: ArticleListItem[]
}

export type GetArticlesResult = [string, (url: string) => Promise<GetArticlesData>]

export function getArticles ({
  categories,
  categoriesNotIn
}: GetArticlesArgs): GetArticlesResult {
  return listArticles({
    categories,
    categoriesNotIn,
    limit: 1000
  }) as GetArticlesResult
}

export interface GetCategoriesData {
  data: CategoryWithChildren[]
}

export type GetCategoriesResult = [string, (url: string) => Promise<GetCategoriesData>]

export function getCategories (): GetCategoriesResult {
  return categoriesTree() as GetCategoriesResult
}
