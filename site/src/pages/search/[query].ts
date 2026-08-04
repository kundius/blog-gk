import { SearchPage } from '@components/SearchPage'
import { searchArticles } from '@app/api/articles'

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [pageKey, pageFetcher] = searchArticles(String(params.query), 20)
  preloadData[pageKey] = await pageFetcher(pageKey)

  return {
    props: {
      preloadData,
      query: params.query
    },
    revalidate: 900
  }
}

export default SearchPage
