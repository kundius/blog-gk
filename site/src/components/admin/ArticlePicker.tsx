'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { ArticleRecord } from '@app/lib/admin/types'
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
import { CoverImage } from '@components/CoverImage'

interface ArticlePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  excludedIds?: string[]
  onConfirm: (articles: ArticleRecord[]) => void
}

export function ArticlePicker({
  open,
  onOpenChange,
  excludedIds = [],
  onConfirm,
}: ArticlePickerProps) {
  const [articles, setArticles] = useState<ArticleRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const load = useCallback(async (q?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100', sort: '-dateCreated' })
      if (q) params.set('search', q)
      const res = await api.list<ArticleRecord>(`/articles?${params.toString()}`)
      setArticles(res.data)
    } catch {
      setArticles([])
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
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const confirm = () => {
    const chosen = articles.filter((a) => selected.has(a.id))
    onConfirm(chosen)
    onOpenChange(false)
  }

  const visible = articles.filter((a) => !excludedIds.includes(a.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Выбор статей</DialogTitle>
        </DialogHeader>

        <SearchInput
          value={search}
          onCommit={handleSearch}
          placeholder="Поиск по названию..."
          className="w-full"
        />

        <div className="max-h-[50vh] overflow-y-auto rounded-md border">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-none border-b" />
            ))}
          {!loading &&
            visible.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => toggle(article.id)}
                className={cn(
                  'flex w-full items-center gap-3 border-b px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-muted/60',
                  selected.has(article.id) && 'bg-muted',
                )}
              >
                <div className="relative size-9 shrink-0 overflow-hidden rounded bg-muted">
                  {article.thumbnail ? (
                    <CoverImage
                      src={fileStreamUrl(article.thumbnail.id)}
                      alt={article.name}
                      blurHash={article.thumbnail.blurhash}
                      sizes="36px"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{article.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {article.category?.name ?? 'Без категории'}
                  </div>
                </div>
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border',
                    selected.has(article.id)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input',
                  )}
                >
                  {selected.has(article.id) && <Check className="size-3" />}
                </span>
              </button>
            ))}
          {!loading && visible.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Статьи не найдены
            </p>
          )}
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
            Добавить ({selected.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
