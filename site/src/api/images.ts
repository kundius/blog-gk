export function fileUrl(filenameDisk?: string | null): string {
  return filenameDisk ? `/files/${filenameDisk}` : ''
}

export function fileSrc(filenameDisk?: string | null): string {
  return filenameDisk ? `/files/${filenameDisk}` : ''
}
