import { ContentPage } from '@components/ContentPage'
import { pageByAlias, listPages } from '@app/api/pages'

export async function getStaticPaths() {
  const [key, fetcher] = listPages({ limit: 1000 })
  const result = await fetcher(key)
  const paths = (result.data || []).map((page) => ({
    params: {
      page: page.alias
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [pageKey, pageFetcher] = pageByAlias(params.page)
  const pageData = await pageFetcher(pageKey)

  if (!pageData.data) {
    return {
      notFound: true
    }
  }

  preloadData[pageKey] = pageData

  return {
    props: {
      preloadData,
      alias: params.page
    },
    revalidate: 900
  }
}

export default ContentPage
