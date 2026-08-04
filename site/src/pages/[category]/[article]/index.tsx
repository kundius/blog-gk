import { ArticlePage } from '@components/ArticlePage'
import { articleByAlias, relatedArticles, listArticles } from '@app/api/articles'

export async function getStaticPaths() {
  const [key, fetcher] = listArticles({ limit: 1000 })
  const result = await fetcher(key)
  const paths = (result.data || []).map((article) => ({
    params: {
      article: article.alias,
      category: article.category.alias
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [articleKey, articleFetcher] = articleByAlias(params.article)
  const articleData = await articleFetcher(articleKey)
  preloadData[articleKey] = articleData

  if (!articleData.data) {
    return {
      notFound: true
    }
  }

  const [relatedKey, relatedFetcher] = relatedArticles(articleData.data.id, 2)
  preloadData[relatedKey] = await relatedFetcher(relatedKey)

  return {
    props: {
      preloadData,
      alias: params.article
    },
    revalidate: 900
  }
}

export default ArticlePage
