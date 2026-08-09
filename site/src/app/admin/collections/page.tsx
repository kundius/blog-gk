'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Plus, Trash2, Pencil, Library } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { CollectionRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, LoadingState, ErrorState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import { CoverImage } from '@components/CoverImage'

export default function AdminCollectionsPage() {
  const { data, error, isLoading, mutate } = useSWR('/collections?limit=200', () =>
    api.list<CollectionRecord>('/collections?limit=200'),
  )

  const handleDelete = async (collection: CollectionRecord) => {
    try {
      await api.delete(`/collections/${collection.id}`)
      toast.success('Подборка удалена')
      void mutate()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка удаления')
    }
  }

  return (
    <div>
      <PageHeader
        title="Подборки"
        actions={
          <Link href="/admin/collections/new">
            <Button className="bg-red-400 text-white hover:bg-red-400/90">
              <Plus className="size-4" />
              Новая подборка
            </Button>
          </Link>
        }
      />

      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}

      {data && data.data.length === 0 && (
        <div className="rounded-md border py-10 text-center text-sm text-muted-foreground">
          Подборок пока нет
        </div>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {data.data.map((collection) => (
            <Card key={collection.id} className="overflow-hidden gap-0 py-0">
              <Link href={`/admin/collections/${collection.id}`}>
                <div className="relative aspect-[4/3] bg-muted">
                  {collection.thumbnail ? (
                    <CoverImage
                      src={fileStreamUrl(collection.thumbnail.id)}
                      alt={collection.name}
                      blurHash={collection.thumbnail.blurhash}
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Library className="size-8 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute right-1.5 top-1.5 flex items-center gap-1.5">
                    {collection.showOnHome && (
                      <span className="rounded-full bg-background/90 px-2 py-0.5 text-xs">
                        На главной
                      </span>
                    )}
                    <span className="rounded-full bg-background/90 px-2 py-0.5 text-xs">
                      {collection._count?.articles ?? 0} статей
                    </span>
                  </div>
                </div>
              </Link>
              <CardContent className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/collections/${collection.id}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {collection.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">/{collection.alias}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button asChild variant="ghost" size="icon-sm">
                    <Link href={`/admin/collections/${collection.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <ConfirmDelete
                    title="Удалить подборку?"
                    description={`«${collection.name}» будет удалена безвозвратно.`}
                    onConfirm={() => handleDelete(collection)}
                    trigger={
                      <Button variant="ghost" size="icon-sm" className="text-destructive">
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
