import React from 'react'

import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { categoriesTree } from '@app/api/categories'

import { SWRPreload } from '../swr-preload'

export default async function PublicLayout ({ children }: { children: React.ReactNode }) {
  const [key, fetcher] = categoriesTree()
  const preloadData = {
    [key]: await fetcher(key)
  }

  return (
    <SWRPreload preloadData={preloadData}>
      <Header />
      {children}
      <Footer />
    </SWRPreload>
  )
}
