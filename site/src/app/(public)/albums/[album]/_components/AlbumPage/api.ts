import { albumByAlias } from '@app/api/albums'
import type { Album } from '@app/api/types'

export interface GetAlbumArgs {
  alias: string
}

export interface GetAlbumData {
  data: Album | null
}

export type GetAlbumResult = [string, (url: string) => Promise<GetAlbumData>]

export function getAlbum ({ alias }: GetAlbumArgs): GetAlbumResult {
  return albumByAlias(alias) as GetAlbumResult
}
