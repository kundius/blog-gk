import React from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'

import { MainLayout } from '@components/MainLayout'

import * as api from './api'

export function SitemapPage() {
  const [keyArticles, fetcherArticles] = api.getArticles({})

  const { data: resultArticles } = useSWR<api.GetArticlesData>(
    keyArticles,
    fetcherArticles
  )

  return (
    <MainLayout>
      <Head>
        <title>Карта сайта</title>
      </Head>

      <h1 className="mb-12">Карта сайта</h1>

      <h2 className="text-3xl mb-4 mt-24">Разделы</h2>
      <ul className="uppercase text-sm leading-tight text-red-400 space-y-2">
        <li>
          <Link href="/">
            <a>Кулинарный блог Галины Кундиус</a>
          </Link>
        </li>
        <li>
          <Link href="/pages/about">
            <a>Обо мне</a>
          </Link>
        </li>
        <li>
          <Link href="/cooking">
            <a>Кулинария</a>
          </Link>
          <ul className="ml-8 mt-2 space-y-2">
            <li>
              <Link href="/cooking/krem-i-glazur-dlya-tortov" passHref>
                <a>Крем и глазурь для тортов</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/cakes" passHref>
                <a>Торты, пироги и пирожные</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/drinks" passHref>
                <a>Напитки и десерты</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/salads" passHref>
                <a>Салаты и закуски</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/conservation" passHref>
                <a>Консервация</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/baking" passHref>
                <a>Выпечка</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/cookies" passHref>
                <a>Печенье</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/main-dishes" passHref>
                <a>Вторые блюда</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/entrees" passHref>
                <a>Первые блюда</a>
              </Link>
            </li>
            <li>
              <Link href="/cooking/fish-dishes" passHref>
                <a>Рыбные блюда</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/article/temples" passHref>
            <a>Храмы</a>
          </Link>
        </li>
        <li>
          <Link href="/notes" passHref>
            <a>Заметки</a>
          </Link>
          <ul className="ml-8 mt-2 space-y-2">
            <li>
              <Link href="/notes/zametki-o-vtoryh-blyudah" passHref>
                <a>Вторые блюда</a>
              </Link>
            </li>
            <li>
              <Link href="/notes/zametki-o-vypechke" passHref>
                <a>Выпечка</a>
              </Link>
            </li>
            <li>
              <Link href="/notes/zametki-o-pervyh-blyudah" passHref>
                <a>Первые блюда</a>
              </Link>
            </li>
            <li>
              <Link href="/notes/useful-tips" passHref>
                <a>Полезные советы</a>
              </Link>
            </li>
            <li>
              <Link href="/notes/zametki-o-napitkah" passHref>
                <a>Заметки о напитках</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/article" passHref>
            <a>Статьи</a>
          </Link>
          <ul className="ml-8 mt-2 space-y-2">
            <li>
              <Link href="/article/supernatural" passHref>
                <a>Сверхъестественное</a>
              </Link>
            </li>
            <li>
              <Link href="/article/relationship" passHref>
                <a>Отношения</a>
              </Link>
            </li>
            <li>
              <Link href="/article/subsection-2" passHref>
                <a>Жизненные истории</a>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/albums" passHref>
            <a>Альбомы</a>
          </Link>
        </li>
      </ul>

      <h2 className="text-3xl mb-4 mt-24">Статьи</h2>
      <ul className="uppercase text-sm leading-tight text-red-400 space-y-2">
        {resultArticles?.data.map((item) => (
          <li key={item.id}>
            <Link
              href={`/${item.category.section.alias}/${item.category.alias}/${item.alias}`}
            >
              <a>{item.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </MainLayout>
  )
}
