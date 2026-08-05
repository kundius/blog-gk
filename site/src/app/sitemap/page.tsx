import { SitemapPage } from '@components/SitemapPage'
import { listArticles } from '@app/api/articles'
import { categoriesTree } from '@app/api/categories'

import { SWRPreload } from '../swr-preload'

export const revalidate = 10

export const metadata = {
  title: 'Карта сайта'
}

export default async function SitemapRoute () {
  const [keyArticles, fetcherArticles] = listArticles({ limit: 1000 })
  const [keyCategories, fetcherCategories] = categoriesTree()

  const preloadData = {
    [keyArticles]: await fetcherArticles(keyArticles),
    [keyCategories]: await fetcherCategories(keyCategories)
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <SitemapPage />
    </SWRPreload>
  )
}
