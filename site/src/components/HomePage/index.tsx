'use client'
import React, { useContext } from 'react'
import useSWR from 'swr'
import { BsArrowRightShort } from 'react-icons/bs'
import { FaVk, FaOdnoklassniki } from 'react-icons/fa'
import { DateTime } from 'luxon'
import Link from 'next/link'

import { fileUrl } from '@app/api/images'
import { ArticleCardLatest } from '@components/ArticleCardLatest'
import { Container } from '@components/Container'

import * as api from './api'
import * as styles from './hero-personal.module.css'

export function HomePage() {
  const [keyFirstSection, fetcherFirstSection] = api.getArticles({
    categories: ['baking'],
    limit: 6
  })

  const { data: resultFirstSection } = useSWR<api.GetArticlesData>(
    keyFirstSection,
    fetcherFirstSection
  )

  const [keySecondSection, fetcherSecondSection] = api.getArticles({
    categories: ['entrees'],
    limit: 6
  })

  const { data: resultSecondSection } = useSWR<api.GetArticlesData>(
    keySecondSection,
    fetcherSecondSection
  )

  const [keyThirdSection, fetcherThirdSection] = api.getArticles({
    categories: ['drinks'],
    limit: 6
  })

  const { data: resultThirdSection } = useSWR<api.GetArticlesData>(
    keyThirdSection,
    fetcherThirdSection
  )

  return (
    <Container className="mt-20 mb-20">
      <div className="space-y-24">
        <section className={styles.Hero}>
          <div className={styles.Container}>
            <div className={styles.Photo}>
              <img
                src="/images/about.jpeg"
                alt="Галина Кундиус за приготовлением блюда"
                loading="lazy"
              />
            </div>

            <div className={styles.Content}>
              <h1>
                Блог Галины Кундиус:<br />домашние рецепты и личный опыт
              </h1>

              <p className={styles.Subtitle}>
                Здесь Вы найдете рецепты, по которым я готовлю для семьи в будни
                и&nbsp;на&nbsp;праздники. Это проверенные блюда от&nbsp;бабушек,
                подруг и&nbsp;мои собственные. А&nbsp;еще я делюсь личным опытом
                и&nbsp;рассказываю, как похудела без диет и&nbsp;таблеток.
              </p>

              <div className={styles.Links}>
                <Link href="/about" className={styles.LinkText}>
                  Подробнее обо мне
                </Link>
                <span className={styles.Separator}>•</span>

                <a
                  href="https://vk.com/kundius1962"
                  target="_blank"
                  rel="noopener"
                  aria-label="ВКонтакте"
                >
                  <FaVk />
                </a>

                <a
                  href="https://ok.ru/profile/551711869164"
                  target="_blank"
                  rel="noopener"
                  aria-label="Одноклассники"
                >
                  <FaOdnoklassniki />
                </a>

                <a
                  href="https://zen.yandex.ru/id/5fde7b4beb463f42c5e96c37"
                  target="_blank"
                  rel="noopener"
                  aria-label="Дзен"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 18 18"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 9.24194V8.75806C14.1121 8.58296 12.478 8.20496 11.1214 6.87857C9.79504 5.52203 9.41704 3.88792 9.24194 1H8.75806C8.58296 3.88792 8.20496 5.52203 6.87857 6.87857C5.52203 8.20496 3.88792 8.58296 1 8.75806V9.24194C3.88792 9.41704 5.52203 9.79504 6.87857 11.1214C8.20496 12.478 8.58296 14.1121 8.75806 17H9.24194C9.41704 14.1121 9.79504 12.478 11.1214 11.1214C12.478 9.79504 14.1121 9.41704 17 9.24194Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {renderLatestCooking({
          title: 'Торты, печенье и прочая выпечка',
          href: '/baking',
          data: resultFirstSection?.data
        })}

        {renderLatestCooking({
          title: 'Первые и вторые блюда',
          href: '/entrees',
          data: resultSecondSection?.data
        })}

        {renderLatestCooking({
          title: 'Десерты',
          href: '/drinks',
          data: resultThirdSection?.data
        })}
      </div>
    </Container>
  )

  function renderLatestCooking({ data, title, href }) {
    return (
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-2">
          <h2 className="text-2xl md:text-3xl">{title}</h2>
          <Link href={href} className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">
              смотреть все
              <span className="ml-1 text-xl">
                <BsArrowRightShort />
              </span>
            </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((article) => (
            <ArticleCardLatest
              key={article.alias}
              name={article.name}
              portionCount={article.portionCount}
              cookingTime={article.cookingTime}
              commentsCount={article.commentsCount || 0}
              hitsCount={article.hitsCount || 0}
              excerpt={article.excerpt}
              createdAt={DateTime.fromISO(article.dateCreated)
                .setLocale('ru')
                .toFormat('DDD')}
              thumbnail={
                article.thumbnail
                  ? {
                      name: article.thumbnail?.title || undefined,
                      blurHash: article.thumbnail?.blurhash || undefined,
                      url: fileUrl(article.thumbnail?.filenameDisk)
                    }
                  : undefined
              }
              url={`/${article.category.alias}/${article.alias}`}
              category={{
                name: article.category.name,
                url: `/${article.category.alias}`
              }}
            />
          ))}
        </div>
      </section>
    )
  }
}
