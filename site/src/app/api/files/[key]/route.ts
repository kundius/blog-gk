import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
})

export async function GET (
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
): Promise<Response> {
  const { key } = await params
  const filename = key

  if (!filename) {
    return Response.json({ error: 'missing key' }, { status: 400 })
  }

  const bucket = process.env.S3_BUCKET || ''

  let result
  try {
    result = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: filename })
    )
  } catch {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  const headers = new Headers()
  if (result.ContentType) {
    headers.set('Content-Type', result.ContentType)
  }
  if (result.ContentLength !== undefined) {
    headers.set('Content-Length', String(result.ContentLength))
  }
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  const body = result.Body
  if (!body) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  if (body instanceof Readable) {
    return new Response(Readable.toWeb(body) as ReadableStream, { headers })
  }

  if (typeof (body as Readable).pipe === 'function') {
    return new Response(Readable.toWeb(body as Readable) as ReadableStream, { headers })
  }

  return new Response(new Uint8Array(body as Uint8Array), { headers })
}
