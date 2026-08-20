'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Upload, Check, WandSparkles, Loader2 } from 'lucide-react'
import { api, fileStreamUrl, isEnhanced, enhanceFile } from '@app/lib/admin/client'
import type { FileRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { cn } from '@app/lib/utils'
import { Button } from '@components/ui/button'
import { SearchInput } from '@components/admin/SearchInput'
import { PaginationControls } from '@components/admin/Pagination'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Skeleton } from '@components/ui/skeleton'
import { CoverImage } from '@components/CoverImage'

const PAGE_SIZE = 24

interface MediaPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  multiple?: boolean
  onConfirm: (files: FileRecord[]) => void
}

export function MediaPicker({
  open,
  onOpenChange,
  multiple = false,
  onConfirm,
}: MediaPickerProps) {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const [enhancingId, setEnhancingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async (q?: string, p?: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), sort: '-createdAt' })
      if (q) params.set('search', q)
      params.set('page', String(p ?? 1))
      const res = await api.list<FileRecord>(`/files?${params.toString()}`)
      setFiles(res.data)
      setTotalPages(res.meta.totalPages)
    } catch {
      setFiles([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setSelected(new Set())
      setSearch('')
      setPage(1)
      load(undefined, 1)
    }
  }, [open, load])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
    load(value, 1)
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    void load(search, p)
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (multiple) {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      } else {
        next.clear()
        next.add(id)
      }
      return next
    })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const list = input.files
    if (!list?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(list)) {
        const formData = new FormData()
        formData.append('file', file)
        await api.upload<FileRecord>('/files', formData)
      }
      await load(search, page)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      input.value = ''
      setUploading(false)
    }
  }

  const handleEnhance = async (file: FileRecord) => {
    setEnhancingId(file.id)
    try {
      await enhanceFile(file.id)
      toast.success('Файл улучшен')
      await load(search, page)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка улучшения')
    } finally {
      setEnhancingId(null)
    }
  }

  const confirm = () => {
    const chosen = files.filter((f) => selected.has(f.id))
    onConfirm(chosen)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Медиатека</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput
            value={search}
            onCommit={handleSearch}
            placeholder="Поиск по названию..."
            className="flex-1"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-red-400 text-white hover:bg-red-400/90"
          >
            <Upload className="size-4" />
            {uploading ? 'Загрузка...' : 'Загрузить'}
          </Button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          {!loading &&
            files.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => toggle(file.id)}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-md border transition-colors',
                  selected.has(file.id)
                    ? 'border-primary ring-2 ring-ring'
                    : 'border-border hover:border-ring',
                )}
              >
                <CoverImage
                  src={fileStreamUrl(file.id)}
                  alt={file.title ?? file.filenameDownload}
                  blurHash={file.blurhash}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                />
                {file.type?.startsWith('image/') && !isEnhanced(file) && (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-xs"
                    className="absolute left-1 top-1 bg-background/80 text-foreground hover:bg-background/90"
                    disabled={enhancingId === file.id}
                    onClick={(e) => { e.stopPropagation(); void handleEnhance(file) }}
                  >
                    <span>
                      {enhancingId === file.id
                        ? <Loader2 className="size-3 animate-spin" />
                        : <WandSparkles className="size-3" />}
                    </span>
                  </Button>
                )}
                {isEnhanced(file) && (
                  <span className="absolute left-1 top-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-1 py-0.5 text-[9px] font-medium text-white">
                    улучшено
                  </span>
                )}
                {selected.has(file.id) && (
                  <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            ))}
          {!loading && files.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              Файлы не найдены
            </p>
          )}
          </div>
        </div>

        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={confirm}
            disabled={selected.size === 0}
            className="bg-red-400 text-white hover:bg-red-400/90"
          >
            Выбрать ({selected.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
