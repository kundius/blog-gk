import type { ArticleDetail } from '@app/api/types'
import { fileUrl } from '@app/api/images'

interface LdBase {
  '@context': string
  '@type': string
  name: string
  image?: string | string[]
  description: string
  author: { '@type': string; name: string }
  publisher: { '@type': string; name: string; logo: { '@type': string; url: string } }
}

export function buildRecipeLd(article: ArticleDetail) {
  const thumbnail = fileUrl(article.thumbnail)
  const base: Record<string, unknown> & LdBase = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: article.seoTitle || article.name,
    image: thumbnail || '',
    description: article.seoDescription || article.excerpt || '',
    author: {
      '@type': 'Person',
      name: 'Галина Кундиус',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Блог Галины Кундиус',
      logo: {
        '@type': 'ImageObject',
        url: '/images/logo.png',
      },
    },
  }

  if (article.dateUpdated) {
    base['dateModified'] = article.dateUpdated
  }
  base['datePublished'] = article.dateCreated

  if (article.cookingTime) {
    base['totalTime'] = article.cookingTime
  }
  if (article.portionCount) {
    base['recipeYield'] = `${article.portionCount} порций`
  }

  const ingredients = article.ingredients
    ?.map((i) => i.amount ? `${i.amount} ${i.name}` : i.name)
    .filter(Boolean) ?? []
  if (ingredients.length > 0) {
    base['recipeIngredient'] = ingredients
  }

  const hasNutrition = article.calories != null || article.protein != null || article.fat != null || article.carbs != null
  if (hasNutrition) {
    base['nutrition'] = {
      '@type': 'NutritionInformation',
      servingSize: '100 г',
      ...(article.calories && { calories: `${article.calories} ккал` }),
      ...(article.protein && { proteinContent: `${article.protein} г` }),
      ...(article.fat && { fatContent: `${article.fat} г` }),
      ...(article.carbs && { carbohydrateContent: `${article.carbs} г` }),
    }
  }

  if (article.commentsCount && article.commentsCount > 0) {
    base['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: String(article.commentsCount),
      reviewCount: String(article.commentsCount),
    }
  }

  return base as Record<string, unknown>
}

export function buildArticleLd(article: ArticleDetail) {
  const thumbnail = fileUrl(article.thumbnail)
  const base: Record<string, unknown> & LdBase & { headline: string } = {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    name: article.seoTitle || article.name,
    headline: article.seoTitle || article.name,
    image: thumbnail || '',
    description: article.seoDescription || article.excerpt || '',
    author: {
      '@type': 'Person',
      name: 'Галина Кундиус',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Блог Галины Кундиус',
      logo: {
        '@type': 'ImageObject',
        url: '/images/logo.png',
      },
    },
  }

  if (article.dateUpdated) {
    base['dateModified'] = article.dateUpdated
  }
  base['datePublished'] = article.dateCreated

  return base
}
