'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Upload, Check } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { FileRecord } from '@app/lib/admin/types'
import { cn } from '@app/lib/utils'
import { Button } from '@components/ui/button'
import { SearchInput } from '@components/admin/SearchInput'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Skeleton } from '@components/ui/skeleton'
import { BlurImage } from '@components/admin/BlurImage'

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
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async (q?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100', sort: '-createdAt' })
      if (q) params.set('search', q)
      const res = await api.list<FileRecord>(`/files?${params.toString()}`)
      setFiles(res.data)
    } catch {
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setSelected(new Set())
      setSearch('')
      load()
    }
  }, [open, load])

  const handleSearch = (value: string) => {
    setSearch(value)
    load(value)
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
      await load(search)
      input.value = ''
    } finally {
      setUploading(false)
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
                <BlurImage
                  src={fileStreamUrl(file.id)}
                  blurHash={file.blurhash}
                  alt={file.title ?? file.filenameDownload}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
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
