'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

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
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <div className="flex flex-col gap-12 md:gap-16">
        {result?.data && (
          <header className="hero-surface rounded-[24px] py-5 px-6 md:py-7 md:px-8 lg:py-10 lg:px-12">
            <nav
              className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-400 dark:text-stone-400"
              itemScope
              itemType="http://schema.org/BreadcrumbList"
            >
              <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
              >
                <Link
                  href="/"
                  itemProp="item"
                  className="transition-colors hover:text-[#d36d6d]"
                >
                  <span itemProp="name">Главная</span>
                </Link>
                <meta itemProp="position" content="1" />
              </span>
              <span className="text-gray-300 dark:text-stone-600">/</span>
              <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
              >
                <Link
                  href="/albums"
                  itemProp="item"
                  className="transition-colors hover:text-[#d36d6d]"
                >
                  <span itemProp="name">Альбомы</span>
                </Link>
                <meta itemProp="position" content="2" />
              </span>
              <span className="text-gray-300 dark:text-stone-600">/</span>
              <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
              >
                <span
                  itemProp="name"
                  className="text-gray-600 dark:text-stone-200"
                >
                  {result.data.name}
                </span>
                <meta itemProp="position" content="3" />
              </span>
            </nav>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl dark:text-stone-100">
              {result.data.name}
            </h1>
          </header>
        )}

        <div className="gap-3 sm:gap-6 grid grid-cols-2 lg:grid-cols-3">
          {imagesFiltered.map((item) => (
            <div
              className="overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] w-full bg-card text-card-foreground transition duration-300 ease-out"
              key={item.file?.id}
            >
              <AlbumItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
