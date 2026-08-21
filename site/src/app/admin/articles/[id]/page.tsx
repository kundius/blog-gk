'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { ExternalLink } from 'lucide-react'
import { api } from '@app/lib/admin/client'
import type { ArticleRecord } from '@app/lib/admin/types'
import { ArticleForm } from '@components/admin/ArticleForm'
import { PageHeader, ErrorState, LoadingState } from '@components/admin/common'
import { Button } from '@components/ui/button'

export default function AdminEditArticlePage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: article, error, isLoading } = useSWR(
    id ? `/articles/${id}` : null,
    () => api.get<ArticleRecord>(`/articles/${id}`),
  )

  return (
    <div>
      <PageHeader
        title="Редактирование статьи"
        actions={
          article?.alias && article.category?.alias ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/${article.category.alias}/${article.alias}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-violet-300 text-violet-700 hover:bg-violet-50 hover:text-violet-800 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950 dark:hover:text-violet-200"
              >
                <ExternalLink className="size-4" />
                Открыть страницу
              </a>
            </Button>
          ) : null
        }
      />
      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}
      {article && <ArticleForm article={article} />}
    </div>
  )
}
