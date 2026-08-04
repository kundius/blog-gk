import { CategoryPage } from '@components/CategoryPage'
import { fetchJson } from '@app/utils/fetchJson'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import * as api from '@components/CategoryPage/api'

const { publicRuntimeConfig } = getRuntimeConfig()

export async function getStaticPaths() {
  const categories = await fetchJson(`${publicRuntimeConfig.API_URL}/items/categories?fields=alias,section.alias`)
  const paths = categories.data.map((category) => ({
    params: { category: category.alias, section: category.section.alias }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const [categoryKey, categoryFetcher] = api.getCategory({
    alias: params.category
  })

  const [articlesKey, articlesFetcher] = api.getArticles({
    alias: params.category,
    limit: 5,
    page: 1
  })

  const preloadData = {
    [categoryKey]: await categoryFetcher(categoryKey),
    [articlesKey]: await articlesFetcher(articlesKey)
  }

  if (!preloadData[categoryKey].data) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      preloadData,
      alias: params.category
    },
    revalidate: 900
  }
}

export default CategoryPage
