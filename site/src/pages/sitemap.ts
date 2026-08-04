import { SitemapPage } from '@components/SitemapPage'
import * as api from '@components/SitemapPage/api'

export async function getStaticProps({ params }) {
  const [keyCooking, fetcherCooking] = api.getArticles({
    sectionIn: ['cooking']
  })
  const [keyArticles, fetcherArticles] = api.getArticles({
    sectionNotIn: ['cooking']
  })

  const preloadData = {
    [keyCooking]: await fetcherCooking(keyCooking),
    [keyArticles]: await fetcherArticles(keyArticles)
  }

  return {
    props: {
      preloadData
    },
    revalidate: 10
  }
}

export default SitemapPage
