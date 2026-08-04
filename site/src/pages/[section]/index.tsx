import { SectionPage } from '@components/SectionPage'
import { fetchJson } from '@app/utils/fetchJson'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import * as api from '@components/SectionPage/api'

const { publicRuntimeConfig } = getRuntimeConfig()

export async function getStaticPaths() {
  const sections = await fetchJson(`${publicRuntimeConfig.API_URL}/items/sections?fields=alias`)
  const paths = sections.data.map((section) => ({
    params: { section: section.alias }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const apiSection = api.getSection({
    alias: params.section
  })

  const apiArticles = api.getArticles({
    alias: params.section,
    limit: 5,
    page: 1
  })

  const preloadData = {
    [apiArticles[0]]: await apiArticles[1](apiArticles[0]),
    [apiSection[0]]: await apiSection[1](apiSection[0])
  }

  if (!preloadData[apiSection[0]].data) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      preloadData,
      alias: params.section
    },
    revalidate: 900
  }
}

export default SectionPage
