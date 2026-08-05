'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { MainLayout } from '@components/MainLayout'

import * as api from './api'

export function SitemapPage() {
  const [keyCategories, fetcherCategories] = api.getCategories()
  const [keyArticles, fetcherArticles] = api.getArticles({})

  const { data: resultCategories } = useSWR<api.GetCategoriesData>(
    keyCategories,
    fetcherCategories
  )

  const { data: resultArticles } = useSWR<api.GetArticlesData>(
    keyArticles,
    fetcherArticles
  )

  return (
    <MainLayout>
      <h1 className="mb-12">Карта сайта</h1>

      <h2 className="text-3xl mb-4 mt-24">Разделы</h2>
      <ul className="uppercase text-sm leading-tight text-red-400 space-y-2">
        <li>
          <Link href="/">Кулинарный блог Галины Кундиус</Link>
        </li>
        <li>
          <Link href="/pages/about">Обо мне</Link>
        </li>
        {resultCategories?.data?.map((category) => (
          <li key={category.id}>
            <Link href={`/${category.alias}`}>{category.name}</Link>
            {category.children && category.children.length > 0 && (
              <ul className="ml-8 mt-2 space-y-2">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link href={`/${child.alias}`}>{child.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li>
          <Link href="/albums">Альбомы</Link>
        </li>
      </ul>

      <h2 className="text-3xl mb-4 mt-24">Статьи</h2>
      <ul className="uppercase text-sm leading-tight text-red-400 space-y-2">
        {resultArticles?.data.map((item) => (
          <li key={item.id}>
            <Link href={`/${item.category.alias}/${item.alias}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </MainLayout>
  )
}
