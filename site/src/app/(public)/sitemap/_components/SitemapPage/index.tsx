'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { Container } from '@components/Container'
import { PageHeader } from '@components/PageHeader'
import type { CategoryWithChildren } from '@app/api/types'

import * as api from './api'

function renderCategories (categories: CategoryWithChildren[], depth = 0) {
  return (
    <ul className={depth === 0 ? '' : 'ml-8 mt-2 space-y-2'}>
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`/${category.alias}`}>{category.name}</Link>
          {category.children && category.children.length > 0 &&
            renderCategories(category.children, depth + 1)}
        </li>
      ))}
    </ul>
  )
}

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
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <PageHeader title="Карта сайта" />

      <div className="mx-auto mt-12 w-full max-w-[960px] md:mt-16">
        <h2 className="text-3xl mb-4">Разделы</h2>
      <ul className="uppercase text-sm leading-tight text-red-400 space-y-2">
        <li>
          <Link href="/">Кулинарный блог Галины Кундиус</Link>
        </li>
        <li>
          <Link href="/about">Обо мне</Link>
        </li>
        {renderCategories(resultCategories?.data || [])}
        <li>
          <Link href="/albums">Альбомы</Link>
        </li>
        <li>
          <Link href="/collections">Подборки</Link>
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
      </div>
    </Container>
  )
}
