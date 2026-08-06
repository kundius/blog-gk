'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { api } from '@app/lib/admin/client'
import type { AlbumRecord } from '@app/lib/admin/types'
import { AlbumForm } from '@components/admin/AlbumForm'
import { PageHeader, ErrorState, LoadingState } from '@components/admin/common'

export default function AdminEditAlbumPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: album, error, isLoading } = useSWR(id ? `/albums/${id}` : null, () =>
    api.get<AlbumRecord>(`/albums/${id}`),
  )

  return (
    <div>
      <PageHeader title="Редактирование альбома" />
      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}
      {album && <AlbumForm album={album} />}
    </div>
  )
}
