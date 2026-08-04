import { SitemapPage } from '@components/SitemapPage'
import { listArticles } from '@app/api/articles'
import { categoriesTree } from '@app/api/categories'

export async function getStaticProps() {
  const [keyArticles, fetcherArticles] = listArticles({ limit: 1000 })
  const [keyCategories, fetcherCategories] = categoriesTree()

  const preloadData = {
    [keyArticles]: await fetcherArticles(keyArticles),
    [keyCategories]: await fetcherCategories(keyCategories)
  }

  return {
    props: {
      preloadData
    },
    revalidate: 10
  }
}

export default SitemapPage
