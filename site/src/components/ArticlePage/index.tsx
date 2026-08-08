'use client'
import React, { useState, useContext, useEffect, useRef } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { DateTime } from 'luxon'
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight
} from 'react-icons/hi'
import {
  FacebookShareButton,
  FacebookIcon,
  OKShareButton,
  OKIcon,
  PinterestShareButton,
  PinterestIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  VKShareButton,
  VKIcon
} from 'react-share'

import { Content } from '@components/Content'
import { Image } from '@components/Image'
import { ClocheIcon } from '@components/Icon/cloche'
import { ToqueIcon } from '@components/Icon/toque'
import { CommentsIcon } from '@components/Icon/comments'
import { CLIENT_URL } from '@app/utils/config'
import { fileUrl } from '@app/api/images'
import { Container } from '@components/Container'
import { ArticleRelated } from '@components/ArticleRelated'
import { Comments } from '@components/Comments'
import { Ingredients } from '@components/Ingredients'
import { ArticleLikes } from '@components/ArticleLikes'

import { Hits } from './Hits'
import * as api from './api'

interface ArticlePageProps {
  alias: string
}

export function ArticlePage({ alias }: ArticlePageProps) {
  const [key, fetcher] = api.getArticle({ alias })
  const { data: result } = useSWR<api.GetArticleData>(key, fetcher)

  let previousApi: api.GetPreviousResult | undefined
  let nextApi: api.GetNextResult | undefined
  if (result?.data) {
    previousApi = api.getPrevious({
      id: result.data.id
    })
    nextApi = api.getNext({
      id: result.data.id
    })
  }

  const { data: previousResult } = useSWR<api.GetPreviousData>(
    () => previousApi?.[0] || null,
    previousApi?.[1] || null
  )
  const { data: nextResult } = useSWR<api.GetNextData>(
    () => nextApi?.[0] || null,
    nextApi?.[1] || null
  )

  const pageUrl = `${CLIENT_URL}/${result?.data?.category.alias}/${result?.data?.alias}`
  const imageUrl = fileUrl(result?.data?.thumbnail?.filenameDisk)
  const isRecipe = !!result?.data?.ingredients

  return (
    <Container className="mt-20 mb-20">
      {result?.data && (
        <div
          className="grid gap-24"
          itemScope
          itemType={
            isRecipe ? 'http://schema.org/Recipe' : 'http://schema.org/Article'
          }
        >
          <div className="max-w-2xl ml-auto mr-auto">
            <div className="mb-8 flex gap-4 justify-around items-center tracking-wide">
              <div
                className="text-xs uppercase text-red-400"
                itemScope
                itemType="http://schema.org/BreadcrumbList"
              >
                <span
                  itemProp="itemListElement"
                  itemScope
                  itemType="http://schema.org/ListItem"
                >
                  <Link href={`/${result.data.category.alias}`} className="hover:text-red-400" itemProp="item">
                      <span itemProp="name">{result.data.category.name}</span>
                      <meta itemProp="position" content="1" />
                    </Link>
                </span>
              </div>
              <div className="hidden">
                <span itemProp="author">Галина Кундиус</span>
                <div
                  itemProp="publisher"
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <div
                    itemProp="logo"
                    itemScope
                    itemType="https://schema.org/ImageObject"
                  >
                    <img itemProp="url image" src="/images/logo.png" />
                    <meta itemProp="width" content="118" />
                    <meta itemProp="height" content="118" />
                  </div>
                  <meta itemProp="name" content="Блог Галины Кундиус" />
                  <meta itemProp="telephone" content="+7 961 028 0539" />
                  <meta itemProp="address" content="г. Воронеж" />
                </div>
                <meta
                  itemProp="dateModified"
                  content={result.data.dateUpdated || undefined}
                />
                <meta
                  itemScope
                  itemProp="mainEntityOfPage"
                  itemType="https://schema.org/WebPage"
                  itemID={pageUrl}
                />
              </div>
              <time
                className="text-xs text-gray-400 whitespace-nowrap"
                itemProp="datePublished"
                dateTime={result.data.dateCreated}
              >
                {DateTime.fromISO(result.data.dateCreated)
                  .setLocale('ru')
                  .toFormat('DDD')
                  .replace(' г.', '')}
              </time>
            </div>

            <h1
              className="text-4xl md:text-5xl text-center font-bold tracking-wide"
              itemProp="headline name"
            >
              {result.data.name}
            </h1>

            <div className="transition duration-300 ease-out border-b border-gray-200 dark:border-gray-600 mt-14 pb-2 flex items-center justify-between gap-4 md:gap-8 flex-col md:flex-row">
              {isRecipe && (
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                      <ToqueIcon />
                    </div>
                    <div className="text-xs uppercase">
                      <meta
                        itemProp="totalTime"
                        content={`PT${
                          result.data.cookingTime
                            ? result.data.cookingTime.replace(/[^0-9]/g, '')
                            : 45
                        }M`}
                      />
                      {result.data.cookingTime || '45 минут'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                      <ClocheIcon />
                    </div>
                    <div className="text-xs uppercase" itemProp="recipeYield">
                      {result.data.portionCount || 1}
                    </div>
                  </div>
                </div>
              )}
              <div className="hidden md:block" />
              <div className="flex items-center gap-8">
                <Hits
                  id={result.data.id}
                  initialHits={result.data.hitsCount || 0}
                />
                <a href={`#comments`} className="flex items-center gap-8">
                  <span className="flex items-center gap-2">
                    <span className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                      <CommentsIcon />
                    </span>
                    <span className="text-xs uppercase">
                      {result.data.commentsCount || 0}
                    </span>
                  </span>
                </a>
                <ArticleLikes
                  id={result.data.id}
                  initialLikes={result.data.likesCount || 0}
                />
              </div>
            </div>

            {result.data.thumbnail && (
              <figure
                className="mt-8 mb-8 overflow-hidden"
                itemScope
                itemProp="image"
                itemType="http://schema.org/ImageObject"
              >
                <Image
                  src={fileUrl(result.data.thumbnail?.filenameDisk) || ''}
                  alt={result.data.thumbnail?.title || undefined}
                  blurHash={result.data.thumbnail.blurhash}
                  width={675}
                  height={
                    (675 / (result.data.thumbnail.width || 1)) *
                    (result.data.thumbnail.height || 1)
                  }
                  objectFit="cover"
                  layout="responsive"
                />
                <img
                  className="hidden"
                  itemProp="url contentUrl"
                  src={fileUrl(result.data.thumbnail?.filenameDisk) || ''}
                />
                <meta itemProp="width" content={String(675)} />
                <meta
                  itemProp="height"
                  content={String(
                    (675 / (result.data.thumbnail.width || 1)) *
                      (result.data.thumbnail.height || 1)
                  )}
                />
              </figure>
            )}

            {isRecipe && (
              <img
                className="hidden"
                itemProp="resultPhoto"
                src={fileUrl(result.data.thumbnail?.filenameDisk) || ''}
              />
            )}

            {result.data.ingredients && (
              <div className="mt-8 mb-16">
                <Ingredients items={result.data.ingredients} />
              </div>
            )}

            <Content
              dangerouslySetInnerHTML={{ __html: result.data.content }}
              itemProp={isRecipe ? 'recipeInstructions' : 'articleBody'}
            />
          </div>

          <div className="transition duration-300 ease-out flex flex-col md:flex-row items-center justify-between gap-4 pt-4 pb-4 border-t border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-8">
              <div className="text-sm leading-none text-gray-400 hidden lg:block">
                Понравилась статья?
                <br />
                Поделись с друзьями
              </div>
              <div className="flex gap-2">
                <FacebookShareButton url={pageUrl}>
                  <FacebookIcon size={32} borderRadius={32} />
                </FacebookShareButton>
                <TwitterShareButton url={pageUrl}>
                  <TwitterIcon size={32} borderRadius={32} />
                </TwitterShareButton>
                <VKShareButton url={pageUrl} image={fileUrl(result.data.thumbnail?.filenameDisk)}>
                  <VKIcon size={32} borderRadius={32} />
                </VKShareButton>
                <OKShareButton url={pageUrl}>
                  <OKIcon size={32} borderRadius={32} />
                </OKShareButton>
                <TelegramShareButton url={pageUrl}>
                  <TelegramIcon size={32} borderRadius={32} />
                </TelegramShareButton>
                {result.data.thumbnail && (
                  <PinterestShareButton
                    url={pageUrl}
                    media={fileUrl(result.data.thumbnail.filenameDisk)}
                  >
                    <PinterestIcon size={32} borderRadius={32} />
                  </PinterestShareButton>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {previousResult?.data && (
                <Link
                  href={`/${previousResult.data.category.alias}/${previousResult.data.alias}`}
                  rel="prev"
                  className="flex items-center bg-red-400 hover:bg-red-600 text-white text-xs md:text-sm md:tracking-widest leading-8 md:leading-8 uppercase px-5 rounded-full"
                  title={previousResult.data.name}
                >
                  <HiOutlineChevronDoubleLeft className="mr-1" />
                  Предыдущая
                </Link>
              )}
              {nextResult?.data && (
                <Link
                  href={`/${nextResult.data.category.alias}/${nextResult.data.alias}`}
                  rel="prev"
                  className="flex items-center bg-red-400 hover:bg-red-600 text-white text-xs md:text-sm md:tracking-widest leading-8 md:leading-8 uppercase px-5 rounded-full"
                  title={nextResult.data.name}
                >
                  Следующая
                  <HiOutlineChevronDoubleRight className="mr-1" />
                </Link>
              )}
            </div>
          </div>

          <ArticleRelated id={result.data.id} />

          <Comments threadId={result.data.id} threadType="articles" />
        </div>
      )}
    </Container>
  )
}
