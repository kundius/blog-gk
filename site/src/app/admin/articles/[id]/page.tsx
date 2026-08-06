'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { api } from '@app/lib/admin/client'
import type { ArticleRecord } from '@app/lib/admin/types'
import { ArticleForm } from '@components/admin/ArticleForm'
import { PageHeader, ErrorState, LoadingState } from '@components/admin/common'

export default function AdminEditArticlePage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: article, error, isLoading } = useSWR(
    id ? `/articles/${id}` : null,
    () => api.get<ArticleRecord>(`/articles/${id}`),
  )

  return (
    <div>
      <PageHeader title="Редактирование статьи" />
      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}
      {article && <ArticleForm article={article} />}
    </div>
  )
}
