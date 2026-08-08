'use client'
import React, { useState, useContext, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import { Pagination } from '@components/Pagination'
import { ArticleCardMain } from '@components/ArticleCardMain'
import { fileUrl } from '@app/api/images'
import { MainLayout } from '@components/MainLayout'
import { Container } from '@components/Container'

import * as api from './api'
import { Card } from './Card'

export function AlbumsPage() {
  const [albumsKey, albumsFetcher] = api.getAlbums()

  const { data: albumsResult } = useSWR<api.GetAlbumsData>(
    albumsKey,
    albumsFetcher
  )

  return (
    <Container className="mt-20 mb-20">
      <MainLayout>
        <h1 className="mb-12">Альбомы</h1>

      {(albumsResult?.data?.length || 0) === 0 && (
        <div className="text-center text-xl">
          Записи в данном разделе отсутствуют
        </div>
      )}

      <div className="grid grid-cols-2 gap-12">
        {albumsResult?.data?.map((album) => (
          <Card
            key={album.alias}
            name={album.name}
            thumbnail={
              album.thumbnail
                ? {
                    name: album.thumbnail?.title || undefined,
                    blurHash: album.thumbnail?.blurhash || undefined,
                    url: fileUrl(album.thumbnail?.filenameDisk)
                  }
                : undefined
            }
            href={`/albums/${album.alias}`}
          />
        ))}
      </div>
      </MainLayout>
    </Container>
  )
}
