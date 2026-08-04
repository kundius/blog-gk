import fetch from 'isomorphic-unfetch'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

const { publicRuntimeConfig } = getRuntimeConfig()

const blogPostsRssXml = articles => {
  let latestPostDate = ''
  let rssItemsXml = ''
  articles.forEach(article => {
    const postDate = Date.parse(article.date_created)

    // Remember to change this URL to your own!
    const postHref = `${publicRuntimeConfig.CLIENT_URL}/${article.category.section.alias}/${article.category.alias}/${article.alias}`

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = article.date_created
    }

    rssItemsXml += `
      <item>
        <title><![CDATA[${article.name}]]></title>
        <link>${postHref}</link>
        <pubDate>${article.date_created}</pubDate>
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

const getRssXml = blogPosts => {
  const { rssItemsXml, latestPostDate } = blogPostsRssXml(blogPosts)

  // Edit the '<link>' and '<description>' data here to reflect your own website details!
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
  const res = await fetch(`${publicRuntimeConfig.API_URL}/items/articles?fields=alias,name,content,excerpt,date_created,category.alias,category.section.alias`)
  const articles = await res.json()
  return articles.data
}

export async function getServerSideProps(context) {
  const res = context.res
  if (!res) {
    return
  }
  const posts = await fetchMyPosts()
  const xml = getRssXml(posts)
  res.setHeader("Content-Type", "text/xml")
  res.write(xml)
  res.end()
}

export default function RssPage () {
  return null
}
