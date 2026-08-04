import fetch from 'isomorphic-unfetch'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

const { publicRuntimeConfig } = getRuntimeConfig()

const blogPostsRssXml = articles => {
  let latestPostDate = ''
  let sitemapItemsXml = ''
  articles.forEach(article => {
    const postDate = Date.parse(article.date_updated || article.date_created)

    // Remember to change this URL to your own!
    const postHref = `${publicRuntimeConfig.CLIENT_URL}/${article.category.section.alias}/${article.category.alias}/${article.alias}`

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = article.date_updated || article.date_created
    }

    sitemapItemsXml += `
      <url>
        <loc>${postHref}</loc>
        <lastmod>${article.date_updated || article.date_created}</lastmod>
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

  // Edit the '<link>' and '<description>' data here to reflect your own website details!
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    ${sitemapItemsXml}
  </urlset>`
}

const fetchMyPosts = async () => {
  const res = await fetch(`${publicRuntimeConfig.API_URL}/items/articles?fields=alias,date_updated,date_created,category.alias,category.section.alias&limit=-1`)
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

export default function SitemapPage () {
  return null
}
