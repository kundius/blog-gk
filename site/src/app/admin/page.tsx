'use client'

import React, { useEffect, useState } from 'react'
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
import { PageHeader, LoadingState, ErrorState } from '@components/admin/common'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { ArticleStatusBadge } from '@components/admin/ArticleStatusBadge'

function useCount(path: string) {
  const { data, error } = useSWR(path, () => api.list(path), {
    revalidateOnFocus: false,
  })
  return data?.meta?.total ?? (error ? null : undefined)
}

const STATS = [
  { href: '/admin/articles', key: '/articles?limit=1', label: 'Статьи', icon: FileText },
  { href: '/admin/categories', key: '/categories?limit=1', label: 'Категории', icon: FolderTree },
  { href: '/admin/albums', key: '/albums?limit=1', label: 'Альбомы', icon: Images },
  { href: '/admin/files', key: '/files?limit=1', label: 'Файлы', icon: FolderOpen },
  { href: '/admin/subscribers', key: '/subscribers?limit=1', label: 'Подписчики', icon: Users },
  { href: '/admin/comments', key: '/comments?limit=1', label: 'Комментарии', icon: MessageSquare },
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

  return (
    <div>
      <PageHeader title="Дашборд" description="Обзор контента блога" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map((stat) => {
          const count = useCount(stat.key)
          const Icon = stat.icon
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="transition-colors hover:bg-muted/40">
                <CardContent className="flex items-center gap-3 p-4">
                  <Icon className="size-5 text-muted-foreground" />
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
