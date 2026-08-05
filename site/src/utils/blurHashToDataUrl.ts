import { decode, isBlurhashValid } from 'blurhash'

const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32 (data: Uint8Array, start = 0, end = data.length): number {
  let c = 0xffffffff
  for (let i = start; i < end; i++) {
    c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function adler32 (data: Uint8Array): number {
  let a = 1
  let b = 0
  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % 65521
    b = (b + a) % 65521
  }
  return ((b << 16) | a) >>> 0
}

function deflateStored (data: Uint8Array): Uint8Array {
  const chunkSize = 65535
  const chunks = Math.ceil(data.length / chunkSize)
  const output = new Uint8Array(2 + data.length + chunks * 5)
  let offset = 0

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, data.length)
    const len = end - start
    const isLast = i === chunks - 1

    output[offset++] = isLast ? 0x01 : 0x00
    output[offset++] = len & 0xff
    output[offset++] = (len >> 8) & 0xff
    output[offset++] = (~len) & 0xff
    output[offset++] = ((~len) >> 8) & 0xff
    output.set(data.subarray(start, end), offset)
    offset += len
  }

  const compressed = output.subarray(0, offset)
  const adler = adler32(data)
  const zlib = new Uint8Array(compressed.length + 6)
  const zview = new DataView(zlib.buffer)
  zlib[0] = 0x78
  zlib[1] = 0x01
  zlib.set(compressed, 2)
  zview.setUint32(zlib.length - 4, adler, false)

  return zlib
}

function chunk (type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new Uint8Array([...type].map((ch) => ch.charCodeAt(0)))
  const output = new Uint8Array(12 + data.length)
  const view = new DataView(output.buffer)
  view.setUint32(0, data.length, false)
  output.set(typeBytes, 4)
  output.set(data, 8)
  view.setUint32(8 + data.length, crc32(output, 4, 8 + data.length), false)
  return output
}

export function encodePng (rgba: Uint8Array | Uint8ClampedArray, width: number, height: number): string {
  const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = new Uint8Array(13)
  const view = new DataView(ihdr.buffer)
  view.setUint32(0, width, false)
  view.setUint32(4, height, false)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const raw = new Uint8Array(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * (1 + width * 4) + 1)
  }

  const parts: Uint8Array[] = [
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateStored(raw)),
    chunk('IEND', new Uint8Array(0))
  ]

  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const png = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    png.set(part, offset)
    offset += part.length
  }

  let binary = ''
  for (let i = 0; i < png.length; i++) {
    binary += String.fromCharCode(png[i])
  }
  return `data:image/png;base64,${btoa(binary)}`
}

export function blurHashToDataUrl (blurHash: string | null | undefined, width = 32, height = 32): string | undefined {
  if (!blurHash || !isBlurhashValid(blurHash)) {
    return undefined
  }
  return encodePng(decode(blurHash, width, height), width, height)
}
