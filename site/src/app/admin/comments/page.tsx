'use client'

import React, { useEffect } from 'react'
import useSWR from 'swr'
import { useQueryState, parseAsInteger, parseAsStringEnum } from 'nuqs'
import { Check, Trash2, X } from 'lucide-react'
import { api } from '@app/lib/admin/client'
import type { CommentRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'

const PAGE_SIZE = 20

export default function AdminCommentsPage() {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum(['pending', 'published', 'all']).withDefault('pending'),
  )
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const status = tab === 'all' ? '' : tab

  const { data, error, isLoading, mutate } = useSWR(
    `/comments?limit=${PAGE_SIZE}&page=${page}${status ? `&status=${status}` : ''}`,
    () =>
      api.list<CommentRecord>(
        `/comments?limit=${PAGE_SIZE}&page=${page}${status ? `&status=${status}` : ''}`,
      ),
  )

  const totalPages = Math.max(1, Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE))

  useEffect(() => {
    if (data && page > totalPages) {
      void setPage(totalPages)
    }
  }, [data, page, totalPages, setPage])

  const approve = async (comment: CommentRecord) => {
    try {
      await api.patch(`/comments/${comment.id}`, { status: 'published' })
      toast.success('Комментарий опубликован')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  const decline = async (comment: CommentRecord) => {
    try {
      await api.delete(`/comments/${comment.id}`)
      toast.success('Комментарий отклонён')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <div>
      <PageHeader title="Комментарии" description="Модерация комментариев" />

      <Tabs
        value={tab}
        onValueChange={(v) => {
          void setTab(v as 'pending' | 'published' | 'all')
          void setPage(1)
        }}
      >
        <TabsList>
          <TabsTrigger value="pending">На модерации</TabsTrigger>
          <TabsTrigger value="published">Опубликованные</TabsTrigger>
          <TabsTrigger value="all">Все</TabsTrigger>
        </TabsList>

        {isLoading && (
          <div className="mt-4">
            <LoadingState rows={6} />
          </div>
        )}
        {error && (
          <div className="mt-4">
            <ErrorState message={error.message} />
          </div>
        )}

        {data && (
          <div className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Комментарий</TableHead>
                    <TableHead className="hidden md:table-cell">Автор</TableHead>
                    <TableHead className="hidden lg:table-cell">Статья</TableHead>
                    <TableHead className="w-28 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        Комментариев нет
                      </TableCell>
                    </TableRow>
                  )}
                  {data.data.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-[360px]">
                        <div className="space-y-0.5">
                          <p className="line-clamp-2">{comment.content || '(без текста)'}</p>
                          {comment.parent && (
                            <p className="text-xs text-muted-foreground">
                              ↳ ответ на: {comment.parent.content?.slice(0, 80) || '…'}
                            </p>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {comment.dateCreated
                              ? new Date(comment.dateCreated).toLocaleString('ru-RU')
                              : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <div className="text-sm font-medium">{comment.authorName || 'Аноним'}</div>
                          {comment.authorEmail && (
                            <div className="text-xs text-muted-foreground">
                              {comment.authorEmail}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate lg:table-cell">
                        {comment.article ? (
                          <a
                            href={`/${comment.article.alias}`}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-sm hover:underline"
                          >
                            {comment.article.name}
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {comment.status === 'pending' ? (
                            <Button variant="ghost" size="icon-xs" onClick={() => void approve(comment)}>
                              <Check className="size-4 text-emerald-600" />
                            </Button>
                          ) : (
                            <Badge variant="secondary">опубл.</Badge>
                          )}
                          <ConfirmDelete
                            title="Отклонить комментарий?"
                            description="Комментарий будет удалён безвозвратно."
                            onConfirm={() => decline(comment)}
                            trigger={
                              <Button variant="ghost" size="icon-xs" className="text-destructive">
                                <X className="size-4" />
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

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => void setPage((p) => Math.max(1, p - 1))}
                >
                  Назад
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => void setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Вперёд
                </Button>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  )
}
