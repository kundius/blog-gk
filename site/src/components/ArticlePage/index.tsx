import React, { useState, useContext, useEffect, useRef } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import Head from 'next/head'
import { DateTime } from 'luxon'
import { AiOutlineTag } from 'react-icons/ai'
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

import { YandexRTB } from '@components/YandexRTB'
import { Content } from '@components/Content'
import { Image } from '@components/Image'
import { ClocheIcon } from '@components/Icon/cloche'
import { ToqueIcon } from '@components/Icon/toque'
import { CommentsIcon } from '@components/Icon/comments'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { WideLayout } from '@components/WideLayout'
import { ArticleRelated } from '@components/ArticleRelated'
import { Comments } from '@components/Comments'
import { Ingredients } from '@components/Ingredients'
import { ArticleLikes } from '@components/ArticleLikes'

import { Hits } from './Hits'
import * as api from './api'
import * as styles from './styles.module.css'

const { publicRuntimeConfig } = getRuntimeConfig()

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
      id: result.data.id,
      date: result.data.date_created
    })
    nextApi = api.getNext({
      id: result.data.id,
      date: result.data.date_created
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

  const pageUrl = `${publicRuntimeConfig.CLIENT_URL}/${result?.data?.category.section.alias}/${result?.data?.category.alias}/${result?.data?.alias}`
  const imageUrl = `${publicRuntimeConfig.API_URL}/assets/${result?.data?.thumbnail?.filename_disk}`
  const isRecipe = !!result?.data?.ingredients

  /*useEffect(() => {
    console.log(`${publicRuntimeConfig.API_URL}/assets/${result?.data?.thumbnail?.filename_disk}`)
    Ya.share2('ya-share2', {
      theme: { services: 'messenger,vkontakte,odnoklassniki,telegram,twitter,viber,whatsapp' },
      content: { url: location.href, image: `${publicRuntimeConfig.API_URL}/assets/${result?.data?.thumbnail?.filename_disk}` }
    });
  }, [])*/

  return (
    <WideLayout>
      <Head>
        <title>{result?.data?.seo_title || result?.data?.name}</title>
        <meta name="description" content={result?.data?.seo_description} />
        <meta name="keywords" content={result?.data?.seo_keywords} />

        <meta property="og:title" content={result?.data?.name} />
        <meta
          property="og:description"
          content={result?.data?.seo_description}
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />

        <link rel="canonical" href={pageUrl} />
      </Head>
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
                  <Link
                    href={`/${result.data.category.section.alias}`}
                    passHref
                  >
                    <a className="hover:text-red-400" itemProp="item">
                      <span itemProp="name">
                        {result.data.category.section.name}
                      </span>
                      <meta itemProp="position" content="1" />
                    </a>
                  </Link>
                </span>
                <span className="ml-1 mr-1">/</span>
                <span
                  itemProp="itemListElement"
                  itemScope
                  itemType="http://schema.org/ListItem"
                >
                  <Link
                    href={`/${result.data.category.section.alias}/${result.data.category.alias}`}
                    passHref
                  >
                    <a className="hover:text-red-400" itemProp="item">
                      <span itemProp="name">{result.data.category.name}</span>
                      <meta itemProp="position" content="2" />
                    </a>
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
                  content={result.data.date_updated}
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
                dateTime={result.data.date_created}
              >
                {DateTime.fromISO(result.data.date_created)
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
                          result.data.cooking_time
                            ? result.data.cooking_time.replace(/[^0-9]/g, '')
                            : 45
                        }M`}
                      />
                      {result.data.cooking_time || '45 минут'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                      <ClocheIcon />
                    </div>
                    <div className="text-xs uppercase" itemProp="recipeYield">
                      {result.data.portion_count || 1}
                    </div>
                  </div>
                </div>
              )}
              <div className="hidden md:block" />
              <div className="flex items-center gap-8">
                <Hits
                  id={result.data.id}
                  initialHits={result.data.hits_count || 0}
                />
                <a href={`#comments`} className="flex items-center gap-8">
                  <span className="flex items-center gap-2">
                    <span className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
                      <CommentsIcon />
                    </span>
                    <span className="text-xs uppercase">
                      {result.data.comments_count || 0}
                    </span>
                  </span>
                </a>
                <ArticleLikes id={result.data.id} />
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
                  src={`${publicRuntimeConfig.API_URL}/assets/${result.data.thumbnail?.filename_disk}`}
                  alt={result.data.thumbnail?.title}
                  blurHash={result.data.thumbnail.blurhash}
                  width={675}
                  height={
                    (675 / result.data.thumbnail.width) *
                    result.data.thumbnail.height
                  }
                  objectFit="cover"
                  layout="responsive"
                />
                <img
                  className="hidden"
                  itemProp="url contentUrl"
                  src={`${publicRuntimeConfig.API_URL}/assets/${result.data.thumbnail?.filename_disk}`}
                />
                <meta itemProp="width" content={String(675)} />
                <meta
                  itemProp="height"
                  content={String(
                    (675 / result.data.thumbnail.width) *
                      result.data.thumbnail.height
                  )}
                />
              </figure>
            )}

            {isRecipe && (
              <img
                className="hidden"
                itemProp="resultPhoto"
                src={`${publicRuntimeConfig.API_URL}/assets/${result.data.thumbnail?.filename_disk}`}
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

            <div className={`${styles.Advert} mt-16`}>
              <YandexRTB id={'R-A-2214092-1'} />
            </div>

            {result.data.tags?.[0] && (
              <div className="flex items-start leading-none mt-16">
                <div className="flex items-center">
                  <AiOutlineTag />
                  <div className="text-sm ml-2">Теги</div>
                </div>
                <div className="ml-4 flex flex-wrap text-sm text-gray-400 uppercase gap-1">
                  {result.data.tags.map((item) => (
                    <a key={item.tag.alias}>#{item.tag.name}</a>
                  ))}
                </div>
              </div>
            )}
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
                <VKShareButton url={pageUrl} image={`${publicRuntimeConfig.API_URL}/assets/${result.data.thumbnail?.filename_disk}`}>
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
                    media={`${publicRuntimeConfig.API_URL}/assets/${result.data.thumbnail.filename_disk}`}
                  >
                    <PinterestIcon size={32} borderRadius={32} />
                  </PinterestShareButton>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {previousResult?.data && (
                <Link
                  href={`/${previousResult.data.category.section.alias}/${previousResult.data.category.alias}/${previousResult.data.alias}`}
                  passHref
                >
                  <a
                    rel="prev"
                    className="flex items-center bg-red-400 hover:bg-red-600 text-white text-xs md:text-sm md:tracking-widest leading-8 md:leading-8 uppercase px-5 rounded-full"
                    title={previousResult.data.name}
                  >
                    <HiOutlineChevronDoubleLeft className="mr-1" />
                    Предыдущая
                  </a>
                </Link>
              )}
              {nextResult?.data && (
                <Link
                  href={`/${nextResult.data.category.section.alias}/${nextResult.data.category.alias}/${nextResult.data.alias}`}
                  passHref
                >
                  <a
                    rel="prev"
                    className="flex items-center bg-red-400 hover:bg-red-600 text-white text-xs md:text-sm md:tracking-widest leading-8 md:leading-8 uppercase px-5 rounded-full"
                    title={nextResult.data.name}
                  >
                    Следующая
                    <HiOutlineChevronDoubleRight className="mr-1" />
                  </a>
                </Link>
              )}
            </div>
          </div>

          <ArticleRelated id={result.data.id} />

          <Comments threadId={result.data.id} threadType="articles" />
        </div>
      )}
    </WideLayout>
  )
}
