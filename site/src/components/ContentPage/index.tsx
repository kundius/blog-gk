'use client'
import React from 'react'

import { Content } from '@components/Content'
import { MainLayout } from '@components/MainLayout'

export interface StaticPage {
  name: string
  content?: string | null
}

interface ContentPageProps {
  page: StaticPage
}

export function ContentPage({ page }: ContentPageProps) {
  return (
    <MainLayout>
      <h1 className="mb-12">{page?.name}</h1>

      <Content dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
    </MainLayout>
  )
}
