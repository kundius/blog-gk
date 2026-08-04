import { searchArticles, articleById } from '@app/api/articles'
import type { ArticleDetail, ArticleListItem } from '@app/api/types'

export interface SearchArgs {
  search: string
  limit: number
  page: number
}

export interface SearchData {
  data: ArticleListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type SearchResult = [string, (url: string) => Promise<SearchData>]

export function Search ({ search, limit, page }: SearchArgs): SearchResult {
  return searchArticles(search, limit, page) as SearchResult
}

export interface GetArticleArgs {
  id: string
}

export interface GetArticleData {
  data: ArticleDetail | null
}

export type GetArticleResult = [string, (url: string) => Promise<GetArticleData>]

export function GetArticle ({ id }: GetArticleArgs): GetArticleResult {
  return articleById(id) as GetArticleResult
}
