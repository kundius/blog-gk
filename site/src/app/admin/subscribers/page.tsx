'use client'

import React, { useEffect } from 'react'
import useSWR from 'swr'
import { useQueryState, parseAsInteger } from 'nuqs'
import { Trash2, Download } from 'lucide-react'
import { api } from '@app/lib/admin/client'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { SearchInput } from '@components/admin/SearchInput'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'

const PAGE_SIZE = 20

interface SubscriberRecord {
  id: string
  email: string
  dateCreated?: string | null
}

export default function AdminSubscribersPage() {
  const [q, setQ] = useQueryState('q', { defaultValue: '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const commitSearch = (value: string) => {
    void setPage(1)
    void setQ(value)
  }

  const buildKey = () => {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
    if (q) params.set('search', q)
    params.set('page', String(page))
    return `/subscribers?${params.toString()}`
  }

  const { data, error, isLoading, mutate } = useSWR(buildKey(), () =>
    api.list<SubscriberRecord>(buildKey()),
  )

  const totalPages = Math.max(1, Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE))

  useEffect(() => {
    if (data && page > totalPages) {
      void setPage(totalPages)
    }
  }, [data, page, totalPages, setPage])

  const handleDelete = async (subscriber: SubscriberRecord) => {
    try {
      await api.delete(`/subscribers/${subscriber.id}`)
      toast.success('Подписчик удалён')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка удаления')
    }
  }

  const exportCsv = () => {
    if (!data?.data.length) return
    const header = 'email,date'
    const rows = data.data
      .map((s) => `${s.email},${s.dateCreated ?? ''}`)
      .join('\n')
    const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Подписчики"
        description="Email-рассылка"
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!data?.data.length}>
            <Download className="size-4" />
            Экспорт CSV
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          value={q}
          onCommit={commitSearch}
          placeholder="Поиск по email..."
          className="max-w-sm"
        />
      </div>

      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}

      {data && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Дата подписки</TableHead>
                <TableHead className="w-20 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    Подписчиков нет
                  </TableCell>
                </TableRow>
              )}
              {data.data.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {subscriber.dateCreated
                      ? new Date(subscriber.dateCreated).toLocaleDateString('ru-RU')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDelete
                      title="Удалить подписчика?"
                      description={`${subscriber.email} больше не будет получать рассылку.`}
                      onConfirm={() => handleDelete(subscriber)}
                      trigger={
                        <Button variant="ghost" size="icon-xs" className="text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
  )
}
