import fetch from 'isomorphic-unfetch'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

const { publicRuntimeConfig } = getRuntimeConfig()

const blogPostsRssXml = articles => {
  let latestPostDate = ''
  let sitemapItemsXml = ''
  articles.forEach(article => {
    const postDate = Date.parse(article.dateUpdated || article.dateCreated)

    const postHref = `${publicRuntimeConfig.CLIENT_URL}/${article.category.alias}/${article.alias}`

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = article.dateUpdated || article.dateCreated
    }

    sitemapItemsXml += `
      <url>
        <loc>${postHref}</loc>
        <lastmod>${article.dateUpdated || article.dateCreated}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>`
  })
  return {
    sitemapItemsXml,
    latestPostDate
  }
}

const getRssXml = blogPosts => {
  const { sitemapItemsXml, latestPostDate } = blogPostsRssXml(blogPosts)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    ${sitemapItemsXml}
  </urlset>`
}

const fetchMyPosts = async () => {
  const res = await fetch(`${publicRuntimeConfig.API_URL}/api/articles?limit=1000&sort=-dateCreated`)
  const articles = await res.json()
  return articles.data || []
}

export default async function handler(req, res) {
  const posts = await fetchMyPosts()
  const xml = getRssXml(posts)
  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(xml)
}
