import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CollectionPage } from './_components/CollectionPage'
import { collectionByAlias, listCollections } from '@app/api/collections'

import { SWRPreload } from '../../../swr-preload'

export const revalidate = 10
export const dynamicParams = true

export interface CollectionPageParams {
  collection: string
}

export async function generateStaticParams () {
  const [key, fetcher] = listCollections({ limit: 1000 })
  const result = await fetcher(key)
  return (result.data || []).map((collection: { alias: string }) => ({
    collection: collection.alias
  }))
}

export async function generateMetadata ({ params }: { params: Promise<CollectionPageParams> }): Promise<Metadata> {
  const { collection } = await params
  const [collectionKey, collectionFetcher] = collectionByAlias(collection)
  const result = await collectionFetcher(collectionKey)

  if (!result?.data) {
    return {}
  }

  const { data } = result

  return {
    title: data.seoTitle || data.name,
    description: data.seoDescription || undefined,
    keywords: data.seoKeywords || undefined
  }
}

export default async function CollectionRoute ({ params }: { params: Promise<CollectionPageParams> }) {
  const { collection } = await params

  const preloadData: Record<string, unknown> = {}

  const [collectionKey, collectionFetcher] = collectionByAlias(collection)
  const collectionData = await collectionFetcher(collectionKey)

  if (!collectionData.data) {
    notFound()
  }

  preloadData[collectionKey] = collectionData

  return (
    <SWRPreload preloadData={preloadData}>
      <CollectionPage alias={collection} />
    </SWRPreload>
  )
}
