'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import { useQueryState, parseAsInteger } from 'nuqs'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import { usePaginatedList } from '@app/lib/admin/usePaginatedList'
import type { ArticleRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { SearchInput } from '@components/admin/SearchInput'
import { ArticleStatusBadge } from '@components/admin/ArticleStatusBadge'
import { CoverImage } from '@components/CoverImage'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { PaginationControls } from '@components/admin/Pagination'

const PAGE_SIZE = 20

export default function AdminArticlesPage() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [status, setStatus] = useQueryState('status', { defaultValue: 'all' })
  const [q, setQ] = useQueryState('q', { defaultValue: '' })

  const commitSearch = (value: string) => {
    void setPage(1)
    void setQ(value)
  }

  const buildKey = useCallback(() => {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), sort: '-dateCreated' })
    if (q) params.set('search', q)
    if (status !== 'all') params.set('status', status)
    params.set('page', String(page))
    return `/articles?${params.toString()}`
  }, [q, status, page])

  const { data, error, isLoading, mutate, totalPages } = usePaginatedList<ArticleRecord>(
    buildKey(),
    PAGE_SIZE,
    page,
    (p) => void setPage(p),
  )

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/articles/${id}`)
      toast.success('Статья удалена')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка удаления')
    }
  }

  return (
    <div>
      <PageHeader
        title="Статьи"
        actions={
          <Link href="/admin/articles/new">
            <Button className="bg-red-400 text-white hover:bg-red-400/90">
              <Plus className="size-4" />
              Новая статья
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <SearchInput
          value={q}
          onCommit={commitSearch}
          placeholder="Поиск по названию..."
          className="flex-1"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            void setStatus(v)
            void setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="published">Опубликованы</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingState rows={8} />}
      {error && <ErrorState message={error.message} />}

      {data && (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead className="hidden md:table-cell">Категория</TableHead>
                    <TableHead className="hidden sm:table-cell">Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="w-24 text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      Статей не найдено
                    </TableCell>
                  </TableRow>
                )}
                {data.data.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-75 whitespace-normal">
                      <div className="flex items-start gap-2">
                        {article.thumbnail ? (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                            <CoverImage
                              src={fileStreamUrl(article.thumbnail.id)}
                              alt={article.thumbnail.title ?? ''}
                              blurHash={article.thumbnail.blurhash}
                              sizes="40px"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="size-10 shrink-0 rounded-md border border-dashed bg-muted" />
                        )}
                        <div className="min-w-0">
                          <span className="mb-0.5 block font-medium">{article.name}</span>
                          {article.alias && (
                            <a
                              href={`/${article.category?.alias ?? ''}/${article.alias}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block truncate text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                              /{article.alias}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-normal">
                      {article.category?.name ?? '—'}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                      {article.dateCreated
                        ? new Date(article.dateCreated).toLocaleDateString('ru-RU')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <ArticleStatusBadge status={article.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={`/admin/articles/${article.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <ConfirmDelete
                          title="Удалить статью?"
                          description={`«${article.name}» будет удалена безвозвратно.`}
                          onConfirm={() => handleDelete(article.id)}
                          trigger={
                            <Button variant="ghost" size="icon-sm" className="text-destructive">
                              <Trash2 className="size-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => void setPage(p)}
          />
        </>
      )}
    </div>
  )
}
