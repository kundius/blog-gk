import { createRequire } from 'node:module'
import fs from 'node:fs'

const require = createRequire('/app/package.json')
const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3')

const BUCKET = process.env.S3_BUCKET || ''
const CONCURRENCY = parseInt(process.env.SYNC_CONCURRENCY || '16', 10)
const MAX_ATTEMPTS = parseInt(process.env.SYNC_MAX_ATTEMPTS || '4', 10)
const MANIFEST = process.env.SYNC_MANIFEST || '/migrate/files_manifest.csv'
const LOG = process.env.SYNC_LOG || '/runtime/sync.log'
const FAILURES = process.env.SYNC_FAILURES || '/runtime/sync_failures.json'
const PROGRESS = process.env.SYNC_PROGRESS || '/runtime/sync_progress.txt'

const client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
})

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`
  try { fs.appendFileSync(LOG, line + '\n') } catch {}
  console.log(line)
}

async function listExistingKeys() {
  const keys = new Set()
  let token
  do {
    const res = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: token,
      MaxKeys: 1000,
    }))
    for (const o of res.Contents || []) keys.add(o.Key)
    token = res.NextContinuationToken
  } while (token)
  return keys
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const lines = fs.readFileSync(MANIFEST, 'utf8').trim().split('\n').slice(1)
  const items = []
  for (const line of lines) {
    const [id, disk, type] = line.trim().split(',')
    if (id && disk) items.push({ id, disk, type })
  }

  const existing = await listExistingKeys()
  const todo = items.filter((i) => !existing.has(i.disk))
  log(`manifest=${items.length} existing_in_s3=${existing.size} todo=${todo.length}`)

  const failures = []
  let idx = 0
  let ok = 0
  let lastLog = Date.now()
  let loggedFailures = 0

  function maybeLog() {
    if (ok % 250 === 0 || failures.length - loggedFailures > 0 || Date.now() - lastLog > 15000) {
      loggedFailures = failures.length
      lastLog = Date.now()
      log(`progress ok=${ok} failed=${failures.length} remaining=${todo.length - idx}`)
      try { fs.writeFileSync(PROGRESS, `todo=${todo.length} ok=${ok} failed=${failures.length} remaining=${todo.length - idx}`) } catch {}
    }
  }

  async function worker() {
    while (true) {
      const i = idx++
      if (i >= todo.length) return
      const it = todo[i]
      let success = false
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const resp = await fetch('https://api.blog-gk.ru/assets/' + it.id, { signal: AbortSignal.timeout(60000) })
          if (!resp.ok) throw new Error('http ' + resp.status)
          const body = Buffer.from(await resp.arrayBuffer())
          await client.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: it.disk,
            Body: body,
            ContentType: it.type || undefined,
          }))
          ok++
          success = true
          break
        } catch (err) {
          if (attempt === MAX_ATTEMPTS) {
            failures.push({ id: it.id, key: it.disk, error: String(err && err.message || err) })
            if (failures.length <= 30 || failures.length % 500 === 0) {
              try { fs.appendFileSync(LOG, 'FAIL ' + it.id + ' ' + it.disk + ' :: ' + (err && err.message || err) + '\n') } catch {}
            }
          } else {
            await sleep(800 * attempt + Math.random() * 400)
          }
        }
      }
      maybeLog()
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker())
  await Promise.all(workers)

  fs.writeFileSync(FAILURES, JSON.stringify(failures, null, 2))
  maybeLog()
  log(`DONE ok=${ok} failed=${failures.length} total_todo=${todo.length}`)
}

process.on('unhandledRejection', (e) => { try { fs.appendFileSync(LOG, 'UNHANDLED ' + (e && e.stack || e) + '\n') } catch {} process.exit(1) })
process.on('uncaughtException', (e) => { try { fs.appendFileSync(LOG, 'UNCAUGHT ' + (e && e.stack || e) + '\n') } catch {} process.exit(1) })

main().catch((err) => {
  log('FATAL ' + (err && err.stack || err))
  process.exit(1)
})
