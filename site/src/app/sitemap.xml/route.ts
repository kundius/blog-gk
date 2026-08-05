import { API_URL, CLIENT_URL } from '@app/utils/config'

const blogPostsRssXml = (articles: any[]) => {
  let latestPostDate = ''
  let sitemapItemsXml = ''
  articles.forEach(article => {
    const postDate = Date.parse(article.dateUpdated || article.dateCreated)

    const postHref = `${CLIENT_URL}/${article.category.alias}/${article.alias}`

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

const getRssXml = (blogPosts: any[]) => {
  const { sitemapItemsXml } = blogPostsRssXml(blogPosts)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    ${sitemapItemsXml}
  </urlset>`
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
