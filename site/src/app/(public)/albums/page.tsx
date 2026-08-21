import { AlbumsPage } from './_components/AlbumsPage'
import { listAlbums } from '@app/api/albums'

import { SWRPreload } from '../../swr-preload'

export const metadata = {
  title: 'Фотоальбомы',
  description: 'Фотоальбомы с сайта Галины Кундиус — фотографии из путешествий, праздников и повседневной жизни.',
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
