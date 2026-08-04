import React, { useContext, useState } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Lightbox from 'react-image-lightbox'

import { Image } from '@components/Image'
import { MainLayout } from '@components/MainLayout'
import { fileUrl } from '@app/api/images'

import * as api from './api'

interface AlbumPageProps {
  alias: string
}

export function AlbumPage({ alias }: AlbumPageProps) {
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false)
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState(0)

  const [key, fetcher] = api.getAlbum({
    alias
  })

  const { data: result } = useSWR<api.GetAlbumData>(key, fetcher)

  const imagesSource = result?.data?.photos || []
  const imagesFiltered = imagesSource.filter((item) => !!item.file)
  const images = imagesFiltered.map((item) => fileUrl(item.file?.filenameDisk) || '') || []

  return (
    <MainLayout>
      <Head>
        <title>{result?.data?.seoTitle || result?.data?.name}</title>
        <meta
          name="description"
          content={result?.data?.seoDescription || undefined}
        />
        <meta
          name="keywords"
          content={result?.data?.seoKeywords || undefined}
        />
      </Head>

      <h1 className="mb-12">{result?.data?.name}</h1>

      {lightboxIsOpen && (
        <Lightbox
          mainSrc={images[lightboxPhotoIndex]}
          nextSrc={images[(lightboxPhotoIndex + 1) % images.length]}
          prevSrc={
            images[(lightboxPhotoIndex + images.length - 1) % images.length]
          }
          onCloseRequest={() => setLightboxIsOpen(false)}
          onMovePrevRequest={() =>
            setLightboxPhotoIndex(
              (lightboxPhotoIndex + images.length - 1) % images.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxPhotoIndex((lightboxPhotoIndex + 1) % images.length)
          }
        />
      )}

      <div className="gap-4 grid grid-cols-3">
        {imagesFiltered.map((item, i) => (
          <div
            className="overflow-hidden shadow-lg rounded-lg w-full bg-white dark:bg-gray-500 transition duration-300 ease-out"
            key={item.file?.id}
            onClick={() => {
              setLightboxIsOpen(true)
              setLightboxPhotoIndex(i)
            }}
          >
            <Image
              src={fileUrl(item.file?.filenameDisk) || ''}
              alt={item.file?.title || undefined}
              blurHash={item.file?.blurhash}
              width={320}
              height={280}
              objectFit="cover"
              layout="responsive"
            />
            <div className="w-full p-4">
              <p className="text-gray-800 dark:text-white transition duration-300 ease-out text-lg font-medium mb-2">
                {item.file?.title}
              </p>
              <p className="text-gray-400 dark:text-gray-300 transition duration-300 ease-out font-light text-base">
                {item.file?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}
