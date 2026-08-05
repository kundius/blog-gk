const IMAGE_DOMAINS = process.env.IMAGE_DOMAINS || 'localhost'

module.exports = {
  images: {
    remotePatterns: IMAGE_DOMAINS.split(',').filter(Boolean).flatMap((hostname) => [
      { protocol: 'http', hostname },
      { protocol: 'https', hostname }
    ])
  },
  async redirects() {
    return [
      {
        source: '/assets/:slug',
        destination: '/files/:slug',
        permanent: true
      },
      {
        source: '/cooking/:category/:article',
        destination: '/:category/:article',
        permanent: true
      },
      {
        source: '/cooking/:category',
        destination: '/:category',
        permanent: true
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: '/api/rss'
      },
      {
        source: '/files/:key',
        destination: '/api/files/:key'
      }
    ]
  }
}
