import React, { Suspense } from 'react'
import { Container } from '@components/Container'

import { SearchHeader } from './Header'
import { SearchResults } from './Results'

export interface SearchPageProps {
  query: string
}

export function SearchPage({ query }: SearchPageProps) {
  return (
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <div className="flex flex-col gap-12 md:gap-16">
        <SearchHeader query={query} />
        <Suspense>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </Container>
  )
}
