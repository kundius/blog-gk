import { HomePage } from '@components/HomePage'
import { listArticles } from '@app/api/articles'

import { SWRPreload } from './swr-preload'

export const revalidate = 10

export const metadata = {
  title: 'Кулинарные рецепты Галины Кундиус',
  description: 'Блог с рецептами кулинарных блюд для домашнего приготовления и обычные истории из жизни. На сайте можно найти интересные рецепты; салатов, первых, вторых блюд и выпечки.',
  keywords: 'блог кулинария рецепты кулинарные первые вторые блюда домашняя выпечка храмы церкви истории статьи путешествия по святым местам Галина Кундиус'
}

export default async function HomePageRoute () {
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

  return (
    <SWRPreload preloadData={preloadData}>
      <HomePage />
    </SWRPreload>
  )
}
