'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Plus, Trash2, Pencil, Images } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { AlbumRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import { BlurImage } from '@components/admin/BlurImage'

export default function AdminAlbumsPage() {
  const { data, error, isLoading, mutate } = useSWR('/albums?limit=200', () =>
    api.list<AlbumRecord>('/albums?limit=200'),
  )

  const handleDelete = async (album: AlbumRecord) => {
    try {
      await api.delete(`/albums/${album.id}`)
      toast.success('Альбом удалён')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка удаления')
    }
  }

  return (
    <div>
      <PageHeader
        title="Альбомы"
        actions={
          <Link href="/admin/albums/new">
            <Button>
              <Plus className="size-4" />
              Новый альбом
            </Button>
          </Link>
        }
      />

      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}

      {data && data.data.length === 0 && (
        <div className="rounded-md border py-10 text-center text-sm text-muted-foreground">
          Альбомов пока нет
        </div>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {data.data.map((album) => (
            <Card key={album.id} className="overflow-hidden gap-0 py-0">
              <Link href={`/admin/albums/${album.id}`}>
                <div className="relative aspect-[4/3] bg-muted">
                  {album.thumbnail ? (
                    <BlurImage
                      src={fileStreamUrl(album.thumbnail.id)}
                      blurHash={album.thumbnail.blurhash}
                      alt={album.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Images className="size-8 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute right-1.5 top-1.5 rounded-full bg-background/90 px-2 py-0.5 text-xs">
                    {album._count?.photos ?? 0} фото
                  </div>
                </div>
              </Link>
              <CardContent className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/albums/${album.id}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {album.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">/{album.alias}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="ghost" size="icon-xs">
                    <Link href={`/admin/albums/${album.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <ConfirmDelete
                    title="Удалить альбом?"
                    description={`«${album.name}» будет удалён безвозвратно.`}
                    onConfirm={() => handleDelete(album)}
                    trigger={
                      <Button variant="ghost" size="icon-xs" className="text-destructive">
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
