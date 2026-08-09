import { listCollections } from '@app/api/collections'
import type { Collection } from '@app/api/types'

export interface GetCollectionsData {
  data: Collection[]
}

export type GetCollectionsResult = [string, (url: string) => Promise<GetCollectionsData>]

export function getCollections (): GetCollectionsResult {
  return listCollections({ limit: 1000 }) as GetCollectionsResult
}
