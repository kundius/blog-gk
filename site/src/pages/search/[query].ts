import { SearchPage } from '@components/SearchPage'
import * as pageApi from '@components/SearchPage/api'

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}
  
  const [pageKey, pageFetcher] = pageApi.Search({
    search: String(params.query),
    limit: 20,
    page: 1
  })
  const pageData = await pageFetcher(pageKey)
  
  preloadData[pageKey] = pageData

  return {
    props: {
      preloadData,
      query: params.query
    },
    revalidate: 900
  }
}

export default SearchPage
