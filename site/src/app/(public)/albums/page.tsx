import { AlbumsPage } from './_components/AlbumsPage'
import { listAlbums } from '@app/api/albums'

import { SWRPreload } from '../../swr-preload'

export const metadata = {
  title: 'Альбомы'
}

export default async function AlbumsRoute () {
  const [key, fetcher] = listAlbums({ limit: 1000 })
  const preloadData = {
    [key]: await fetcher(key)
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <AlbumsPage />
    </SWRPreload>
  )
}
