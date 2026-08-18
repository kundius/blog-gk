'use client'
import React from 'react'

import { Content } from '@components/Content'
import { Container } from '@components/Container'
import { PageHeader } from '@components/PageHeader'

export interface StaticPage {
  name: string
  content?: string | null
}

interface ContentPageProps {
  page: StaticPage
}

export function ContentPage({ page }: ContentPageProps) {
  return (
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <PageHeader title={page?.name || ''} />

      <div className="mx-auto mt-12 w-full max-w-[960px] md:mt-16">
        <Content dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
      </div>
    </Container>
  )
}
