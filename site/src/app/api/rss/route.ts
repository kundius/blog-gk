import { API_URL, CLIENT_URL } from '@app/utils/config'

const blogPostsRssXml = (articles: any[]) => {
  let latestPostDate = ''
  let rssItemsXml = ''
  articles.forEach(article => {
    const postDate = Date.parse(article.dateCreated)

    const postHref = `${CLIENT_URL}/${article.category.alias}/${article.alias}`

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = article.dateCreated
    }

    rssItemsXml += `
      <item>
        <title><![CDATA[${article.name}]]></title>
        <link>${postHref}</link>
        <pubDate>${article.dateCreated}</pubDate>
        <guid isPermaLink="false">${postHref}</guid>
        <description>
        <![CDATA[${article.excerpt}]]>
        </description>
        <content:encoded>
          <![CDATA[${article.content}]]>
        </content:encoded>
    </item>`
  })
  return {
    rssItemsXml,
    latestPostDate
  }
}

const getRssXml = (blogPosts: any[]) => {
  const { rssItemsXml, latestPostDate } = blogPostsRssXml(blogPosts)

  return `<?xml version="1.0" ?>
  <rss
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    version="2.0"
  >
    <channel>
        <title><![CDATA[Кулинарные рецепты Галины Кундиус]]></title>
        <link>https://blog-gk.ru</link>
        <description>
          <![CDATA[Блог с рецептами кулинарных блюд для домашнего приготовления и обычные истории из жизни. На сайте можно найти интересные рецепты; салатов, первых, вторых блюд и выпечки.]]>
        </description>
        <language>ru</language>
        <lastBuildDate>${latestPostDate}</lastBuildDate>
        ${rssItemsXml}
    </channel>
  </rss>`
}

const fetchMyPosts = async () => {
  const res = await fetch(`${API_URL}/api/articles?limit=1000&sort=-dateCreated`)
  const articles = await res.json()
  return articles.data || []
}

export const dynamic = 'force-dynamic'

export async function GET () {
  const posts = await fetchMyPosts()
  const xml = getRssXml(posts)
  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml'
    }
  })
}
