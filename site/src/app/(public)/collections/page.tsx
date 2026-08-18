import { CollectionsPage } from '@components/CollectionsPage'
import { listCollections } from '@app/api/collections'

import { SWRPreload } from '../../swr-preload'

export const metadata = {
  title: 'Подборки'
}

export default async function CollectionsRoute () {
  const [key, fetcher] = listCollections({ limit: 1000 })
  const preloadData = {
    [key]: await fetcher(key)
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <CollectionsPage />
    </SWRPreload>
  )
}
