import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ArticlePage } from '@components/ArticlePage'
import { articleByAlias, relatedArticles, listArticles } from '@app/api/articles'
import { fileUrl } from '@app/api/images'
import { CLIENT_URL } from '@app/utils/config'

import { SWRPreload } from '../../swr-preload'

export const revalidate = 900
export const dynamicParams = true

export interface ArticlePageParams {
  category: string
  article: string
}

export async function generateStaticParams () {
  const [key, fetcher] = listArticles({ limit: 1000 })
  const result = await fetcher(key)
  return (result.data || []).map((article: { alias: string; category: { alias: string } }) => ({
    article: article.alias,
    category: article.category.alias
  }))
}

export async function generateMetadata ({ params }: { params: Promise<ArticlePageParams> }): Promise<Metadata> {
  const { article } = await params
  const [articleKey, articleFetcher] = articleByAlias(article)
  const result = await articleFetcher(articleKey)

  if (!result?.data) {
    return {}
  }

  const { data } = result
  const pageUrl = `${CLIENT_URL}/${data.category.alias}/${data.alias}`

  return {
    title: data.seoTitle || data.name,
    description: data.seoDescription || undefined,
    keywords: data.seoKeywords || undefined,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: data.name,
      description: data.seoDescription || undefined,
      url: pageUrl,
      type: 'article',
      images: data.thumbnail?.filenameDisk
        ? [{ url: fileUrl(data.thumbnail.filenameDisk) }]
        : undefined
    }
  }
}

export default async function ArticleRoute ({ params }: { params: Promise<ArticlePageParams> }) {
  const { category, article } = await params

  const preloadData: Record<string, unknown> = {}

  const [articleKey, articleFetcher] = articleByAlias(article)
  const articleData = await articleFetcher(articleKey)
  preloadData[articleKey] = articleData

  if (!articleData.data) {
    notFound()
  }

  const { data } = articleData
  if (data.category?.alias && category !== data.category.alias) {
    redirect(`/${data.category.alias}/${data.alias}`)
  }

  const [relatedKey, relatedFetcher] = relatedArticles(data.id, 2)
  preloadData[relatedKey] = await relatedFetcher(relatedKey)

  return (
    <SWRPreload preloadData={preloadData}>
      <ArticlePage alias={article} />
    </SWRPreload>
  )
}
