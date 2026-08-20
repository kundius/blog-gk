import { listAlbums } from '@app/api/albums'
import type { Album } from '@app/api/types'

export interface GetAlbumsData {
  data: Album[]
}

export type GetAlbumsResult = [string, (url: string) => Promise<GetAlbumsData>]

export function getAlbums (): GetAlbumsResult {
  return listAlbums({ limit: 1000 }) as GetAlbumsResult
}
