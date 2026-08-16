import type { File } from './types'

export function fileUrl(file?: File | null): string | undefined {
  return file?.filenameDisk ? `/files/${file.filenameDisk}` : undefined
}
