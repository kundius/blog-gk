import { CategoryPage } from '@components/CategoryPage'
import { categoryByAlias, listCategories } from '@app/api/categories'
import { listArticles } from '@app/api/articles'

export async function getStaticPaths() {
  const [key, fetcher] = listCategories({ limit: 1000 })
  const result = await fetcher(key)
  const paths = (result.data || []).map((category) => ({
    params: { category: category.alias }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const [categoryKey, categoryFetcher] = categoryByAlias(params.category)

  const [articlesKey, articlesFetcher] = listArticles({
    categories: [params.category],
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
