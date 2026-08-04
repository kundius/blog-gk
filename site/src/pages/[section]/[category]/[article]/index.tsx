import { ArticlePage } from '@components/ArticlePage'
import { fetchJson } from '@app/utils/fetchJson'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import * as articleApi from '@components/ArticlePage/api'
import * as relatedApi from '@components/ArticleRelated/api'

const { publicRuntimeConfig } = getRuntimeConfig()

export async function getStaticPaths() {
  const articles = await fetchJson(`${publicRuntimeConfig.API_URL}/items/articles?fields=alias,category.alias,category.section.alias`)
  const paths = articles.data.map((article) => ({
    params: {
      article: article.alias,
      category: article.category.alias,
      section: article.category.section.alias
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [articleKey, articleFetcher] = articleApi.getArticle({
    alias: params.article
  })
  const articleData = await articleFetcher(articleKey)
  preloadData[articleKey] = articleData

  if (!articleData.data) {
    return {
      notFound: true
    }
  }

  const [relatedKey, relatedFetcher] = relatedApi.getRelated({
    id: articleData.data.id,
    limit: 2
  })
  const relatedData = await relatedFetcher(relatedKey)
  preloadData[relatedKey] = relatedData

  return {
    props: {
      preloadData,
      alias: params.article
    },
    revalidate: 900
  }
}

export default ArticlePage
