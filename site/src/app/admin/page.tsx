'use client'

import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  FileText,
  MessageSquare,
  FolderTree,
  Images,
  FolderOpen,
  Users,
} from 'lucide-react'
import { api } from '@app/lib/admin/client'
import type { ArticleRecord, CommentRecord } from '@app/lib/admin/types'
import { cn } from '@app/lib/utils'
import { PageHeader, LoadingState, ErrorState } from '@components/admin/common'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { ArticleStatusBadge } from '@components/admin/ArticleStatusBadge'

const STATS = [
  {
    href: '/admin/articles',
    key: '/articles?limit=1',
    label: 'Статьи',
    icon: FileText,
    color: 'bg-red-400/10 text-red-500 dark:text-red-400',
  },
  {
    href: '/admin/categories',
    key: '/categories?limit=1',
    label: 'Категории',
    icon: FolderTree,
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  },
  {
    href: '/admin/albums',
    key: '/albums?limit=1',
    label: 'Альбомы',
    icon: Images,
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    href: '/admin/files',
    key: '/files?limit=1',
    label: 'Файлы',
    icon: FolderOpen,
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    href: '/admin/subscribers',
    key: '/subscribers?limit=1',
    label: 'Подписчики',
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    href: '/admin/comments',
    key: '/comments?limit=1',
    label: 'Комментарии',
    icon: MessageSquare,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
]

export default function AdminDashboardPage() {
  const { data: recentArticles, error: articlesError } = useSWR(
    '/articles?limit=5&sort=-dateCreated',
    () => api.list<ArticleRecord>('/articles?limit=5&sort=-dateCreated'),
  )
  const { data: pendingComments, error: commentsError } = useSWR(
    '/comments?status=pending&limit=5',
    () => api.list<CommentRecord>('/comments?status=pending&limit=5'),
  )
  const { data: totals, error: totalsError } = useSWR(
    '/dashboard-stats',
    () =>
      Promise.all(STATS.map((stat) => api.list(stat.key).then((r) => r.meta.total))),
    { revalidateOnFocus: false },
  )

  return (
    <div>
      <PageHeader title="Дашборд" description="Обзор контента блога" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map((stat, index) => {
          const count = totals?.[index] ?? (totalsError ? null : undefined)
          const Icon = stat.icon
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="transition-colors hover:bg-muted/40">
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-lg',
                      stat.color,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-semibold leading-none">
                      {count ?? '—'}
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Последние статьи</CardTitle>
          </CardHeader>
          <CardContent>
            {articlesError && <ErrorState message={articlesError.message} />}
            {!recentArticles && !articlesError && <LoadingState rows={4} />}
            {recentArticles && (
              <ul className="divide-y">
                {recentArticles.data.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="flex items-center justify-between gap-3 py-2 text-sm hover:underline"
                    >
                      <span className="truncate">{article.name}</span>
                      <ArticleStatusBadge status={article.status} />
                    </Link>
                  </li>
                ))}
                {recentArticles.data.length === 0 && (
                  <li className="py-4 text-sm text-muted-foreground">
                    Статей пока нет
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ожидают модерации</CardTitle>
          </CardHeader>
          <CardContent>
            {commentsError && <ErrorState message={commentsError.message} />}
            {!pendingComments && !commentsError && <LoadingState rows={4} />}
            {pendingComments && (
              <ul className="divide-y">
                {pendingComments.data.map((comment) => (
                  <li key={comment.id} className="py-2 text-sm">
                    <Link
                      href={`/admin/comments`}
                      className="line-clamp-1 hover:underline"
                    >
                      {comment.content || '(без текста)'}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {comment.authorName} · {comment.article?.name}
                    </span>
                  </li>
                ))}
                {pendingComments.data.length === 0 && (
                  <li className="py-4 text-sm text-muted-foreground">
                    Нет комментариев на модерации
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
