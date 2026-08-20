import { collectionByAlias } from '@app/api/collections'
import type { Collection } from '@app/api/types'

export interface GetCollectionArgs {
  alias: string
}

export interface GetCollectionData {
  data: Collection | null
}

export type GetCollectionResult = [string, (url: string) => Promise<GetCollectionData>]

export function getCollection ({ alias }: GetCollectionArgs): GetCollectionResult {
  return collectionByAlias(alias) as GetCollectionResult
}
