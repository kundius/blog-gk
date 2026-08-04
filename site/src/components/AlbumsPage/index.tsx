import React, { useState, useContext, useEffect, useRef } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import { DateTime } from 'luxon'

import { Pagination } from '@components/Pagination'
import { ArticleCardMain } from '@components/ArticleCardMain'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { MainLayout } from '@components/MainLayout'

import * as api from './api'
import { Card } from './Card'

const { publicRuntimeConfig } = getRuntimeConfig()

export function AlbumsPage() {
  const [albumsKey, albumsFetcher] = api.getAlbums()

  const { data: albumsResult } = useSWR<api.GetAlbumsData>(
    albumsKey,
    albumsFetcher
  )

  return (
    <MainLayout>
      <Head>
        <title>Альбомы</title>
      </Head>

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
                    name: album.thumbnail?.title,
                    blurHash: album.thumbnail?.blurhash,
                    url: `${publicRuntimeConfig.API_URL}/assets/${album.thumbnail?.filename_disk}`
                  }
                : undefined
            }
            href={`/albums/${album.alias}`}
          />
        ))}
      </div>
    </MainLayout>
  )
}
