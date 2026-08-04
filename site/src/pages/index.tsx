import { HomePage } from '@components/HomePage'
import * as api from '@components/HomePage/api'

export async function getStaticProps() {
  const [keyFirstSection, fetcherFirstSection] = api.getArticles({
    aliasIn: ['baking', 'cookies', 'cakes'],
    limit: 6
  })

  const [keySecondSection, fetcherSecondSection] = api.getArticles({
    aliasIn: ['entrees', 'main-dishes'],
    limit: 6
  })

  const [keyThirdSection, fetcherThirdSection] = api.getArticles({
    aliasNotIn: ['baking', 'cookies', 'cakes', 'entrees', 'main-dishes'],
    limit: 6
  })

  const preloadData = {
    [keyFirstSection]: await fetcherFirstSection(keyFirstSection),
    [keySecondSection]: await fetcherSecondSection(keySecondSection),
    [keyThirdSection]: await fetcherThirdSection(keyThirdSection),
  }

  return {
    props: {
      preloadData
    },
    revalidate: 10
  }
}

export default HomePage
