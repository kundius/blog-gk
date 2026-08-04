import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'
import queryString from 'query-string'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetAlbumArgs {
  alias: string
}

export interface GetAlbumData {
  data: {
    id: string
    alias: string
    name: string
    seo_title: string
    seo_keywords: string
    seo_description: string
    images?: {
      file: {
        id: string
        filename_disk: string
        title: string
        description: string
        blurhash: string
        width: number
        height: number
      }
    }[]
  } | undefined
}

export type GetAlbumResult = [string, (url: string) => Promise<GetAlbumData>]

export function getAlbum ({
  alias
}: GetAlbumArgs): GetAlbumResult {
  const params = queryString.stringify({
    'filter[alias][_eq]': alias,
    fields: 'id,alias,content,name,images.file.id,images.file.filename_disk,images.file.title,images.file.description,images.file.width,images.file.height,images.file.blurhash,seo_title,seo_keywords,seo_description'
  })
  const key = `${publicRuntimeConfig.API_URL}/items/albums?${params}`
  const fetcher = url => fetchJson(url).then(r => ({ data: r?.data?.[0] }))
  return [key, fetcher]
}
