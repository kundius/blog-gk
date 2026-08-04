import { ContentPage } from '@components/ContentPage'
import { fetchJson } from '@app/utils/fetchJson'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import * as pageApi from '@components/ContentPage/api'

const { publicRuntimeConfig } = getRuntimeConfig()

export async function getStaticPaths() {
  const pages = await fetchJson(
    `${publicRuntimeConfig.API_URL}/items/pages?fields=alias`
  )
  const paths = pages.data.map((page) => ({
    params: {
      page: page.alias
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [pageKey, pageFetcher] = pageApi.getPage({
    alias: params.page
  })
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
