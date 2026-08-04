const { parsed: localEnv } = require('dotenv').config()

const CLIENT_URL = process.env.CLIENT_URL || (localEnv && localEnv.CLIENT_URL) || 'http://localhost:3000'
const API_URL = process.env.API_URL || (localEnv && localEnv.API_URL) || 'http://localhost:4000'
const GRAPHQL_URL = process.env.GRAPHQL_URL || (localEnv && localEnv.GRAPHQL_URL) || 'http://localhost:4000/graphql'
const IMAGE_DOMAINS = process.env.IMAGE_DOMAINS || (localEnv && localEnv.IMAGE_DOMAINS) || 'localhost'

module.exports = {
  typescript: {
    // ignoreBuildErrors: true,
  },
  images: {
    domains: IMAGE_DOMAINS.split(','),
  },
  serverRuntimeConfig: {
    mySecret: 'secret'
  },
  publicRuntimeConfig: {
    CLIENT_URL,
    API_URL,
    GRAPHQL_URL
  },
  async redirects() {
    return [
      {
        source: '/assets/:slug',
        destination: `${API_URL}/assets/:slug`,
        permanent: true
      }
    ]
  }
}
