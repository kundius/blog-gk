import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AlbumPage } from './_components/AlbumPage'
import { albumByAlias, listAlbums } from '@app/api/albums'

import { SWRPreload } from '../../../swr-preload'

export const revalidate = 10
export const dynamicParams = true

export interface AlbumPageParams {
  album: string
}

export async function generateStaticParams () {
  const [key, fetcher] = listAlbums({ limit: 1000 })
  const result = await fetcher(key)
  return (result.data || []).map((album: { alias: string }) => ({
    album: album.alias
  }))
}

export async function generateMetadata ({ params }: { params: Promise<AlbumPageParams> }): Promise<Metadata> {
  const { album } = await params
  const [albumKey, albumFetcher] = albumByAlias(album)
  const result = await albumFetcher(albumKey)

  if (!result?.data) {
    return {}
  }

  const { data } = result

  return {
    title: data.seoTitle || data.name,
    description: data.seoDescription || undefined,
    keywords: data.seoKeywords || undefined
  }
}

export default async function AlbumRoute ({ params }: { params: Promise<AlbumPageParams> }) {
  const { album } = await params

  const preloadData: Record<string, unknown> = {}

  const [albumKey, albumFetcher] = albumByAlias(album)
  const albumData = await albumFetcher(albumKey)

  if (!albumData.data) {
    notFound()
  }

  preloadData[albumKey] = albumData

  return (
    <SWRPreload preloadData={preloadData}>
      <AlbumPage alias={album} />
    </SWRPreload>
  )
}
