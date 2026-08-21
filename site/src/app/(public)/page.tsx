import { HomePage } from './_components/HomePage'
import { listArticles } from '@app/api/articles'
import { listCollections } from '@app/api/collections'
import { categoriesTree } from '@app/api/categories'

import { SWRPreload } from '../swr-preload'

export const revalidate = 10

export const metadata = {
  title: 'Кулинарные рецепты Галины Кундиус',
  description: 'Блог с рецептами кулинарных блюд для домашнего приготовления и обычные истории из жизни. На сайте можно найти интересные рецепты; салатов, первых, вторых блюд и выпечки.',
  keywords: 'блог кулинария рецепты кулинарные первые вторые блюда домашняя выпечка храмы церкви истории статьи путешествия по святым местам Галина Кундиус'
}

function seasonRange(): { from: string; to: string } {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  let start: Date
  if (month >= 11 || month <= 1) {
    start = new Date(month >= 11 ? year : year - 1, 11, 1)
  } else if (month <= 4) {
    start = new Date(year, 2, 1)
  } else if (month <= 7) {
    start = new Date(year, 5, 1)
  } else {
    start = new Date(year, 8, 1)
  }
  return { from: start.toISOString(), to: now.toISOString() }
}

export default async function HomePageRoute () {
  const period = seasonRange()

  const [keySeason, fetcherSeason] = listArticles({
    limit: 4,
    sort: '-hitsCount',
    dateFrom: period.from,
    dateTo: period.to
  })

  const [keyFresh, fetcherFresh] = listArticles({
    limit: 4,
    sort: '-dateCreated'
  })

  const [keyCollections, fetcherCollections] = listCollections({
    featured: true
  })

  const [keyTree, fetcherTree] = categoriesTree()

  const preloadData = {
    [keySeason]: await fetcherSeason(keySeason),
    [keyFresh]: await fetcherFresh(keyFresh),
    [keyCollections]: await fetcherCollections(keyCollections),
    [keyTree]: await fetcherTree(keyTree)
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <HomePage period={period} />
    </SWRPreload>
  )
}
