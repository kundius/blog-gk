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

const collectionsRssXml = (collections: any[]) => {
  let sitemapItemsXml = `
      <url>
        <loc>${CLIENT_URL}/collections</loc>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
      </url>`
  collections.forEach(collection => {
    const lastmod = collection.dateUpdated || collection.dateCreated
    sitemapItemsXml += `
      <url>
        <loc>${CLIENT_URL}/collections/${collection.alias}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`
  })
  return { sitemapItemsXml }
}

const getRssXml = (blogPosts: any[], collections: any[]) => {
  const { sitemapItemsXml: postsXml } = blogPostsRssXml(blogPosts)
  const { sitemapItemsXml: collectionsXml } = collectionsRssXml(collections)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    ${collectionsXml}
    ${postsXml}
  </urlset>`
}

const fetchMyPosts = async () => {
  const res = await fetch(`${API_URL}/api/articles?limit=1000&sort=-dateCreated`)
  const articles = await res.json()
  return articles.data || []
}

const fetchCollections = async () => {
  const res = await fetch(`${API_URL}/api/collections?limit=1000&sort=name`)
  const collections = await res.json()
  return collections.data || []
}

export const dynamic = 'force-dynamic'

export async function GET () {
  const [posts, collections] = await Promise.all([fetchMyPosts(), fetchCollections()])
  const xml = getRssXml(posts, collections)
  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml'
    }
  })
}
