import { HomePage } from '@components/HomePage'
import { listArticles } from '@app/api/articles'

export async function getStaticProps() {
  const [keyBaking, fetcherBaking] = listArticles({
    categories: ['baking'],
    limit: 6
  })

  const [keyEntrees, fetcherEntrees] = listArticles({
    categories: ['entrees'],
    limit: 6
  })

  const [keyDesserts, fetcherDesserts] = listArticles({
    categories: ['desserts'],
    limit: 6
  })

  const preloadData = {
    [keyBaking]: await fetcherBaking(keyBaking),
    [keyEntrees]: await fetcherEntrees(keyEntrees),
    [keyDesserts]: await fetcherDesserts(keyDesserts)
  }

  return {
    props: {
      preloadData
    },
    revalidate: 10
  }
}

export default HomePage
