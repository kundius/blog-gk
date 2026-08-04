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

  return (
    <MainLayout>
      <Head>
        <title>{result?.data.seo_title || result?.data.name}</title>
        <meta name="description" content={result?.data.seo_description} />
        <meta name="keywords" content={result?.data.seo_keywords} />
      </Head>

      <h1 className="mb-12">{result?.data.name}</h1>

      <Content dangerouslySetInnerHTML={{ __html: result?.data.content }} />
    </MainLayout>
  )
}
