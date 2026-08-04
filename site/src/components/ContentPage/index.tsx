import React from 'react'
import useSWR from 'swr'
import Head from 'next/head'

import { Content } from '@components/Content'
import { MainLayout } from '@components/MainLayout'

import * as api from './api'

interface ContentPageProps {
  alias: string
}

export function ContentPage({ alias }: ContentPageProps) {
  const [key, fetcher] = api.getPage({ alias })
  const { data: result } = useSWR<api.GetPageData>(key, fetcher)

  const page = result?.data

  return (
    <MainLayout>
      <Head>
        <title>{page?.seoTitle || page?.name}</title>
        <meta name="description" content={page?.seoDescription || undefined} />
        <meta name="keywords" content={page?.seoKeywords || undefined} />
      </Head>

      <h1 className="mb-12">{page?.name}</h1>

      <Content dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
    </MainLayout>
  )
}
