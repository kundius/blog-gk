import { NextApiRequest, NextApiResponse } from 'next'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

const client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
})

export const config = {
  api: {
    responseLimit: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key } = req.query
  const filename = Array.isArray(key) ? key.join('/') : key

  if (!filename) {
    res.status(400).json({ error: 'missing key' })
    return
  }

  const bucket = process.env.S3_BUCKET || ''

  let result
  try {
    result = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: filename })
    )
  } catch {
    res.status(404).json({ error: 'not found' })
    return
  }

  if (result.ContentType) {
    res.setHeader('Content-Type', result.ContentType)
  }
  if (result.ContentLength !== undefined) {
    res.setHeader('Content-Length', String(result.ContentLength))
  }
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  const body = result.Body
  if (!body) {
    res.status(404).json({ error: 'not found' })
    return
  }

  if (body instanceof Readable) {
    body.pipe(res)
  } else if (typeof (body as Readable).pipe === 'function') {
    ;(body as Readable).pipe(res)
  } else {
    res.end(body as Uint8Array)
  }
}
