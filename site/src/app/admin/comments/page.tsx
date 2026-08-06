'use client'

import React from 'react'
import { useQueryState, parseAsInteger, parseAsStringEnum } from 'nuqs'
import { Check, Trash2 } from 'lucide-react'
import { api } from '@app/lib/admin/client'
import { usePaginatedList } from '@app/lib/admin/usePaginatedList'
import type { CommentRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { CommentStatusBadge } from '@components/admin/CommentStatusBadge'
import { PaginationControls } from '@components/admin/Pagination'
import {
  Tabs,
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

  const buildKey = () =>
    `/comments?limit=${PAGE_SIZE}&page=${page}${status ? `&status=${status}` : ''}`

  const { data, error, isLoading, mutate, totalPages } = usePaginatedList<CommentRecord>(
    buildKey(),
    PAGE_SIZE,
    page,
    (p) => void setPage(p),
  )

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
                    <TableHead className="hidden sm:table-cell">Дата</TableHead>
                    <TableHead className="w-32">Статус</TableHead>
                    <TableHead className="w-28 text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        Комментариев нет
                      </TableCell>
                    </TableRow>
                  )}
                  {data.data.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-[360px] whitespace-normal">
                        <div className="space-y-0.5">
                          <p>{comment.content || '(без текста)'}</p>
                          {comment.parent && (
                            <p className="truncate text-xs text-muted-foreground">
                              ↳ ответ на: {comment.parent.content?.slice(0, 80) || '…'}
                            </p>
                          )}
                          {comment.article && (
                            <a
                              href={`/${comment.article.alias}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block truncate text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
                            >
                              {comment.article.name}
                            </a>
                          )}
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
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                        {comment.dateCreated
                          ? `${new Date(comment.dateCreated).toLocaleDateString('ru-RU')} ${new Date(
                              comment.dateCreated,
                            ).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <CommentStatusBadge status={comment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {comment.status === 'pending' && (
                            <Button variant="ghost" size="icon-sm" onClick={() => void approve(comment)}>
                              <Check className="size-4 text-emerald-600" />
                            </Button>
                          )}
                          <ConfirmDelete
                            title="Отклонить комментарий?"
                            description="Комментарий будет удалён безвозвратно."
                            onConfirm={() => decline(comment)}
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

            {totalPages > 1 && (
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => void setPage(p)}
              />
            )}
          </div>
        )}
      </Tabs>
    </div>
  )
}
