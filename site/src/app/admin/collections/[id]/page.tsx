'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { api } from '@app/lib/admin/client'
import type { CollectionRecord } from '@app/lib/admin/types'
import { CollectionForm } from '@components/admin/CollectionForm'
import { PageHeader, ErrorState, LoadingState } from '@components/admin/common'

export default function AdminEditCollectionPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const {
    data: collection,
    error,
    isLoading,
    mutate,
  } = useSWR(id ? `/collections/${id}` : null, () =>
    api.get<CollectionRecord>(`/collections/${id}`),
  )

  return (
    <div>
      <PageHeader title="Редактирование подборки" />
      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}
      {collection && <CollectionForm collection={collection} mutate={mutate} />}
    </div>
  )
}
