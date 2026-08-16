'use client'
import React from 'react'
import useSWR from 'swr'

import { MainLayout } from '@components/MainLayout'
import { Container } from '@components/Container'
import { fileUrl } from '@app/api/images'
import type { ArticleFile } from '@app/api/types'
import { CoverImage } from '@components/CoverImage'
import { useLightboxOpen } from '@components/Lightbox'

import * as api from './api'

interface AlbumPageProps {
  alias: string
}

function AlbumItem({ item }: { item: ArticleFile }) {
  const onOpen = useLightboxOpen()

  return (
    <>
      <div className="relative aspect-[8/7] overflow-hidden">
        <CoverImage
          src={fileUrl(item.file) ?? ''}
          alt={item.file?.title || ''}
          blurHash={item.file?.blurhash}
          sizes="(max-width: 768px) 33vw, 25vw"
          loading="lazy"
          onClick={onOpen}
          className="cursor-zoom-in"
        />
      </div>
      <div className="w-full p-4">
        <p className="text-gray-800 dark:text-white transition duration-300 ease-out text-lg font-medium mb-2">
          {item.file?.title}
        </p>
        <p className="text-gray-400 dark:text-gray-300 transition duration-300 ease-out font-light text-base">
          {item.file?.description}
        </p>
      </div>
    </>
  )
}

export function AlbumPage({ alias }: AlbumPageProps) {
  const [key, fetcher] = api.getAlbum({
    alias
  })

  const { data: result } = useSWR<api.GetAlbumData>(key, fetcher)

  const imagesSource = result?.data?.photos || []
  const imagesFiltered = imagesSource.filter((item) => !!item.file)

  return (
    <Container className="mt-20 mb-20">
      <MainLayout>
        <h1 className="mb-12">{result?.data?.name}</h1>

      <div className="gap-4 grid grid-cols-3">
        {imagesFiltered.map((item) => (
          <div
            className="overflow-hidden shadow-lg rounded-lg w-full bg-white dark:bg-gray-500 transition duration-300 ease-out"
            key={item.file?.id}
          >
            <AlbumItem item={item} />
          </div>
        ))}
      </div>
      </MainLayout>
    </Container>
  )
}
