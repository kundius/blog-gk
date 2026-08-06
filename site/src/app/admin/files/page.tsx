'use client'

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useQueryState, parseAsInteger } from 'nuqs'
import { Trash2, Upload, Link as LinkIcon, Copy, Check } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { FileRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import { BlurImage } from '@components/admin/BlurImage'
import { PaginationControls } from '@components/admin/Pagination'
import { SearchInput } from '@components/admin/SearchInput'

const PAGE_SIZE = 24

export default function AdminFilesPage() {
  const [q, setQ] = useQueryState('q', { defaultValue: '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const commitSearch = (value: string) => {
    void setPage(1)
    void setQ(value)
  }

  const buildKey = () => {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), sort: '-createdAt' })
    if (q) params.set('search', q)
    params.set('page', String(page))
    return `/files?${params.toString()}`
  }

  const { data, error, isLoading, mutate } = useSWR(buildKey(), () =>
    api.list<FileRecord>(buildKey()),
  )

  const totalPages = Math.max(1, Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE))

  useEffect(() => {
    if (data && page > totalPages) {
      void setPage(totalPages)
    }
  }, [data, page, totalPages, setPage])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const list = input.files
    if (!list?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(list)) {
        const formData = new FormData()
        formData.append('file', file)
        await api.upload('/files', formData)
      }
      toast.success('Файлы загружены')
      void mutate()
      input.value = ''
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (file: FileRecord) => {
    try {
      await api.delete(`/files/${file.id}`)
      toast.success('Файл удалён')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка удаления')
    }
  }

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(fileStreamUrl(id))
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  return (
    <div>
      <PageHeader title="Медиатека" description="Файлы блога" />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <SearchInput
          value={q}
          onCommit={commitSearch}
          placeholder="Поиск по названию..."
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="size-4" />
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      )}
      {error && <ErrorState message={error.message} />}

      {data && (
        <>
          {data.data.length === 0 && (
            <div className="rounded-md border py-10 text-center text-sm text-muted-foreground">
              Файлов не найдено
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.data.map((file) => (
              <Card key={file.id} className="overflow-hidden gap-0 py-0">
                <div className="group relative aspect-square bg-muted">
                  <BlurImage
                    src={fileStreamUrl(file.id)}
                    blurHash={file.blurhash}
                    alt={file.title ?? file.filenameDownload}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-0.5 bg-gradient-to-t from-black/50 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="bg-background/80 text-foreground"
                      onClick={() => void copyLink(file.id)}
                    >
                      {copiedId === file.id ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </Button>
                    <ConfirmDelete
                      title="Удалить файл?"
                      description="Файл будет удалён из хранилища и всех материалов."
                      onConfirm={() => handleDelete(file)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="bg-background/80 text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      }
                    />
                  </div>
                </div>
                <CardContent className="p-2">
                  <div className="truncate text-xs" title={file.filenameDownload}>
                    {file.title ?? file.filenameDownload}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <LinkIcon className="size-3" />
                    <a
                      href={fileStreamUrl(file.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:underline"
                    >
                      {file.width && file.height
                        ? `${file.width}×${file.height}`
                        : 'ссылка'}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => void setPage(p)}
            />
          )}
        </>
      )}
    </div>
  )
}
