'use client'
import React from 'react'
import useSWR from 'swr'

import { CLIENT_URL } from '@app/utils/config'
import { Container } from '@components/Container'
import { ArticleHeader } from '@app/app/(public)/[category]/[article]/_components/ArticleHeader'
import { ArticleShare } from '@app/app/(public)/[category]/[article]/_components/ArticleShare'
import { ArticleNav } from '@app/app/(public)/[category]/[article]/_components/ArticleNav'
import { ArticleContent } from '@components/ArticleContent'
import { Comments } from '@components/Comments'
import { ArticleRelated } from '@components/ArticleRelated'
import { ArticleLayoutMain } from '@app/app/(public)/[category]/[article]/_components/ArticleLayout/Main'
import { ArticleLayoutRight } from '@app/app/(public)/[category]/[article]/_components/ArticleLayout/Right'
import { ArticleLayoutAd } from '@app/app/(public)/[category]/[article]/_components/ArticleLayout/Ad'
import { ArticleLayoutBottom } from '@app/app/(public)/[category]/[article]/_components/ArticleLayout/Bottom'

import * as api from './api'
import { ArticleIngredients } from '@app/app/(public)/[category]/[article]/_components/ArticleIngredients'
import { ArticleNutrition } from '@app/app/(public)/[category]/[article]/_components/ArticleNutrition'
import { ArticleLayoutLeft } from '@app/app/(public)/[category]/[article]/_components/ArticleLayout/Left'

interface ArticlePageProps {
  alias: string
}

export function ArticlePage ({ alias }: ArticlePageProps) {
  const [key, fetcher] = api.getArticle({ alias })
  const { data: result } = useSWR<api.GetArticleData>(key, fetcher)

  let previousApi: api.GetPreviousResult | undefined
  let nextApi: api.GetNextResult | undefined
  if (result?.data) {
    previousApi = api.getPrevious({ id: result.data.id })
    nextApi = api.getNext({ id: result.data.id })
  }

  const { data: previousResult } = useSWR<api.GetPreviousData>(
    () => previousApi?.[0] || null,
    previousApi?.[1] || null
  )
  const { data: nextResult } = useSWR<api.GetNextData>(
    () => nextApi?.[0] || null,
    nextApi?.[1] || null
  )

  if (!result?.data) {
    return null
  }

  const { data } = result
  const isRecipe = !!data.ingredients
  const pageUrl = `${CLIENT_URL}/${data.category.alias}/${data.alias}`

  const prev =
    previousResult?.data
      ? {
          href: `/${previousResult.data.category.alias}/${previousResult.data.alias}`,
          name: previousResult.data.name
        }
      : null
  const next =
    nextResult?.data
      ? {
          href: `/${nextResult.data.category.alias}/${nextResult.data.alias}`,
          name: nextResult.data.name
        }
      : null

  return (
    <Container className="mt-16 mb-16">
      <div
        className="flex flex-col gap-12"
        itemScope
        itemType={isRecipe ? 'http://schema.org/Recipe' : 'http://schema.org/Article'}
      >
        <ArticleHeader data={data} />

        <ArticleLayoutMain>
          <ArticleLayoutLeft>
              <ArticleIngredients items={data.ingredients || []} />
              <ArticleNutrition
                calories={data.calories}
                protein={data.protein}
                fat={data.fat}
                carbs={data.carbs}
              />
          </ArticleLayoutLeft>

          <ArticleLayoutRight>
            <ArticleContent
              html={data.content || ''}
              itemProp={isRecipe ? 'recipeInstructions' : 'articleBody'}
            />

            <ArticleShare
              url={pageUrl}
              title={data.name}
              heading={isRecipe ? 'Поделиться рецептом' : 'Поделиться статьёй'}
            />

            <ArticleLayoutAd />
          </ArticleLayoutRight>
        </ArticleLayoutMain>

        <ArticleLayoutBottom>
          <ArticleNav prev={prev} next={next} />

          <ArticleRelated id={data.id} />

          <Comments threadId={data.id} threadType="articles" />
        </ArticleLayoutBottom>
      </div>
    </Container>
  )
}
