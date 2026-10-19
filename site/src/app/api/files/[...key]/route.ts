export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CACHE_CONTROL = 'public, max-age=31536000, immutable'
const UPSTREAM_TIMEOUT_MS = 30_000

function buildObjectUrl (filename: string): string | undefined {
  const endpoint = process.env.S3_ENDPOINT?.replace(/\/+$/, '')
  const bucket = process.env.S3_BUCKET
  if (!bucket) return undefined

  const key = filename.split('/').map(encodeURIComponent).join('/')
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true'

  if (endpoint) {
    if (forcePathStyle) {
      return `${endpoint}/${encodeURIComponent(bucket)}/${key}`
    }

    const url = new URL(endpoint)
    url.hostname = `${bucket}.${url.hostname}`
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/${key}`
    return url.toString()
  }

  const region = process.env.S3_REGION || 'us-east-1'
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

export async function GET (
  request: Request,
  { params }: { params: Promise<{ key: string | string[] }> }
): Promise<Response> {
  const { key } = await params
  const filename = Array.isArray(key) ? key.join('/') : key

  if (!filename) {
    return Response.json({ error: 'missing key' }, { status: 400 })
  }

  const objectUrl = buildObjectUrl(filename)
  if (!objectUrl) {
    return Response.json({ error: 'storage is not configured' }, { status: 500 })
  }

  const requestHeaders = new Headers()
  const range = request.headers.get('range')
  if (range) requestHeaders.set('Range', range)

  let upstream: Response
  try {
    upstream = await fetch(objectUrl, {
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]),
      headers: requestHeaders,
      cache: 'no-store'
    })
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError'
    return Response.json(
      { error: timedOut ? 'storage timeout' : 'storage unavailable' },
      { status: timedOut ? 504 : 502 }
    )
  }

  if (upstream.status === 404) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  if (!upstream.ok) {
    return Response.json({ error: 'storage error' }, { status: 502 })
  }

  const headers = new Headers()
  for (const name of [
    'Content-Type',
    'Content-Length',
    'Content-Range',
    'Accept-Ranges',
    'ETag',
    'Last-Modified'
  ]) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.set('Cache-Control', CACHE_CONTROL)

  return new Response(upstream.body, { status: upstream.status, headers })
}
