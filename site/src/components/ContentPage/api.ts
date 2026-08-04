import { pageByAlias } from '@app/api/pages'
import type { Page } from '@app/api/types'

export interface GetPageArgs {
  alias: string
}

export interface GetPageData {
  data: Page | null
}

export type GetPageResult = [string, (url: string) => Promise<GetPageData>]

export function getPage ({ alias }: GetPageArgs): GetPageResult {
  return pageByAlias(alias) as GetPageResult
}
