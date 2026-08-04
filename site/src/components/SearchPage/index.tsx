import React, { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import Head from 'next/head'

import { MainLayout } from '@components/MainLayout'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { Pagination } from '@components/Pagination'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import { Form } from './Form'
import { Card } from './Card'
import * as api from './api'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface SearchPageProps {
  query: string
}

export function SearchPage({ query }: SearchPageProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    if (mounted) {
      scrollToList()
    }
    setMounted(true)
  }, [page])

  useEffect(() => {
    setPage(1)
  }, [query])

  const [searchKey, searchFetcher] = api.Search({
    search: query,
    limit,
    page
  })

  const { data: searchResult } = useSWR<api.SearchData>(
    searchKey,
    searchFetcher
  )

  function scrollToList() {
    if (listRef.current) {
      listRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }

  return (
    <MainLayout>
      <Head>
        <title>{`Поиск «${query || '...'}»`}</title>

        <link
          rel="canonical"
          href={`${publicRuntimeConfig.CLIENT_URL}/search/${query}`}
        />
      </Head>

      <Breadcrumbs
        items={[
          {
            title: 'Главная',
            href: '/'
          },
          {
            title: `Поиск «${query || '...'}»`
          }
        ]}
      />

      <h1 className="mb-8 mt-16">Поиск</h1>

      <Form query={query} />

      <div
        className="grid gap-12 mt-16"
        ref={listRef}
        style={{
          scrollMarginTop: 80
        }}
      >
        {(searchResult?.data?.length || 0) === 0 && (
          <div className="text-center text-xl">
            По вашему запросу ничего не найдено
          </div>
        )}

        {searchResult?.data?.map((item) => (
          <Card key={item.id} id={item.id} />
        ))}

        {(searchResult?.meta?.search_count || 0) > limit && (
          <Pagination
            current={page}
            total={searchResult?.meta?.search_count}
            pageSize={limit}
            onChange={setPage}
          />
        )}
      </div>
    </MainLayout>
  )
}
