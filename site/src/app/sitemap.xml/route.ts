import { API_URL, CLIENT_URL } from '@app/utils/config'

const DAYS_MS = 86400000
const WEEK_DAYS = 7

function isRecent(dateStr: string): boolean {
  const diff = Date.now() - Date.parse(dateStr)
  return diff < WEEK_DAYS * DAYS_MS
}

function getChangeFreq(dateStr: string | null | undefined): string {
  if (!dateStr) return 'monthly'
  if (isRecent(dateStr)) return 'daily'
  const diff = Date.now() - Date.parse(dateStr)
  const days = Math.floor(diff / DAYS_MS)
  if (days < 30) return 'weekly'
  return 'yearly'
}

function urlItem(href: string, dateStr?: string | null, freq?: string, priority?: number) {
  return `
      <url>
        <loc>${href}</loc>
        ${dateStr ? `<lastmod>${dateStr}</lastmod>` : ''}
        <changefreq>${freq || 'monthly'}</changefreq>
        <priority>${priority ?? 0.5}</priority>
      </url>`
}

const fetchMyPosts = async () => {
  const res = await fetch(`${API_URL}/api/articles?limit=1000&sort=-dateCreated`)
  if (!res.ok) return []
  const json = await res.json()
  return json.data || []
}

const fetchCollections = async () => {
  const res = await fetch(`${API_URL}/api/collections?limit=1000&sort=name`)
  if (!res.ok) return []
  const json = await res.json()
  return json.data || []
}

const fetchAlbums = async () => {
  const res = await fetch(`${API_URL}/api/albums?limit=1000&sort=name`)
  if (!res.ok) return []
  const json = await res.json()
  return json.data || []
}

export const dynamic = 'force-dynamic'

export async function GET () {
  const [posts, collections, albums] = await Promise.all([
    fetchMyPosts(),
    fetchCollections(),
    fetchAlbums()
  ])

  const now = new Date().toISOString()

  let itemsXml = ''

  // Static pages
  itemsXml += urlItem(CLIENT_URL, now, 'daily', 1.0)
  itemsXml += urlItem(`${CLIENT_URL}/about`, now, 'monthly', 0.7)
  itemsXml += urlItem(`${CLIENT_URL}/collections`, now, 'weekly', 0.7)
  itemsXml += urlItem(`${CLIENT_URL}/albums`, now, 'monthly', 0.7)

  // Collections list + individual pages
  for (const collection of collections) {
    const lastmod = collection.dateUpdated || collection.dateCreated
    itemsXml += urlItem(
      `${CLIENT_URL}/collections/${collection.alias}`,
      lastmod,
      'weekly',
      0.7
    )
  }

  // Albums list + individual pages
  for (const album of albums) {
    const lastmod = album.dateUpdated || album.dateCreated
    itemsXml += urlItem(
      `${CLIENT_URL}/albums/${album.alias}`,
      lastmod,
      'monthly',
      0.6
    )
  }

  // Articles sorted by date (newest first)
  const sortedPosts = [...posts].sort((a, b) =>
    Date.parse(b.dateUpdated || b.dateCreated) - Date.parse(a.dateUpdated || a.dateCreated)
  )

  for (const article of sortedPosts) {
    const lastmod = article.dateUpdated || article.dateCreated
    const href = `${CLIENT_URL}/${article.category.alias}/${article.alias}`
    const freq = getChangeFreq(lastmod)
    const priority = isRecent(lastmod) ? 0.8 : 0.6
    itemsXml += urlItem(href, lastmod, freq, priority)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    ${itemsXml}
  </urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml'
    }
  })
}
