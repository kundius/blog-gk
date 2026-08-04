import React, { useContext } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import { BsArrowRightShort } from 'react-icons/bs'
import { FaVk, FaOdnoklassniki, FaFacebookF } from 'react-icons/fa'
import { DateTime } from 'luxon'
import Link from 'next/link'

import { Image } from '@components/Image'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { ArticleCardLatest } from '@components/ArticleCardLatest'
import { WideLayout } from '@components/WideLayout'

import * as api from './api'

const { publicRuntimeConfig } = getRuntimeConfig()

export function HomePage() {
  const [keyFirstSection, fetcherFirstSection] = api.getArticles({
    aliasIn: ['baking', 'cookies', 'cakes'],
    limit: 6
  })

  const { data: resultFirstSection } = useSWR<api.GetArticlesData>(
    keyFirstSection,
    fetcherFirstSection
  )

  const [keySecondSection, fetcherSecondSection] = api.getArticles({
    aliasIn: ['entrees', 'main-dishes'],
    limit: 6
  })

  const { data: resultSecondSection } = useSWR<api.GetArticlesData>(
    keySecondSection,
    fetcherSecondSection
  )

  const [keyThirdSection, fetcherThirdSection] = api.getArticles({
    aliasNotIn: ['baking', 'cookies', 'cakes', 'entrees', 'main-dishes'],
    limit: 6
  })

  const { data: resultThirdSection } = useSWR<api.GetArticlesData>(
    keyThirdSection,
    fetcherThirdSection
  )

  return (
    <WideLayout>
      <Head>
        <title>Кулинарные рецепты Галины Кундиус</title>
        <meta
          name="description"
          content="Блог с рецептами кулинарных блюд для домашнего приготовления и обычные истории из жизни. На сайте можно найти интересные рецепты; салатов, первых, вторых блюд и выпечки."
        />
        <meta
          name="keywords"
          content="блог кулинария рецепты кулинарные первые вторые блюда домашняя выпечка храмы церкви истории статьи путешествия по святым местам Галина Кундиус"
        />
      </Head>
      <div className="space-y-24">
        <section className="transition duration-300 ease-out space-y-6 bg-gray-100 dark:bg-gray-800 p-8 md:p-12 rounded-3xl">
          <div className="items-center grid grid-cols-5 gap-8 md:gap-12">
            <div className="col-span-5 lg:col-span-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 transition duration-300 ease-out">
                Галина Кундиус
              </h1>

              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Приветствую Вас на&nbsp;моем блоге. Здесь Вы найдете кулинарные
                рецепты, по&nbsp;которым я готовила для&nbsp;своей семьи
                в&nbsp;повседневной жизни и&nbsp;на&nbsp;торжества. Моим близким
                и&nbsp;друзьям очень нравится мое кулинарное мастерство, может
                быть Вам тоже понравится. Здесь все рецепты проверенные мной,
                это рецепты наших бабушек, подруг и&nbsp;знакомых.
                Ещё&nbsp;расскажу как я&nbsp;похудела без диеты, лекарств
                и&nbsp;препаратов.
              </p>

              <div className="flex items-center mt-6 -mx-2">
                <a
                  className="mx-2 transition duration-300 ease-out w-5 h-5 text-gray-700 fill-current dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                  href="https://vk.com/kundius1962"
                  target="_blank"
                >
                  <FaVk />
                </a>

                <a
                  className="mx-2 transition duration-300 ease-out w-5 h-5 text-gray-700 fill-current dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                  href="https://ok.ru/profile/551711869164"
                  target="_blank"
                >
                  <FaOdnoklassniki />
                </a>

                <a
                  className="mx-2 transition duration-300 ease-out w-5 h-5 text-gray-700 fill-current dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                  href="https://ok.ru/profile/551711869164"
                  target="_blank"
                >
                  <FaFacebookF />
                </a>

                <a
                  className="mx-2 transition duration-300 ease-out w-5 h-5 text-gray-700 fill-current dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                  href="https://zen.yandex.ru/id/5fde7b4beb463f42c5e96c37"
                  target="_blank"
                >
                  {/* <svg width="1em" height="1em" fill="none" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z" fill="currentColor"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M27.4334 0C27.3011 11.5194 26.5478 17.9662 22.257 22.257C17.9662 26.5478 11.5194 27.3011 0 27.4334V29.1051C11.5194 29.2373 17.9662 29.9906 22.257 34.2814C26.4805 38.5049 27.2766 44.8173 27.4267 56H29.1118C29.2618 44.8173 30.0579 38.5049 34.2814 34.2814C38.5049 30.0579 44.8173 29.2618 56 29.1118V27.4266C44.8173 27.2766 38.5049 26.4805 34.2814 22.257C29.9906 17.9662 29.2373 11.5194 29.1051 0H27.4334Z" fill="white" />
                  </svg> */}
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 18 18"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 9.24194V8.75806C14.1121 8.58296 12.478 8.20496 11.1214 6.87857C9.79504 5.52203 9.41704 3.88792 9.24194 1H8.75806C8.58296 3.88792 8.20496 5.52203 6.87857 6.87857C5.52203 8.20496 3.88792 8.58296 1 8.75806V9.24194C3.88792 9.41704 5.52203 9.79504 6.87857 11.1214C8.20496 12.478 8.58296 14.1121 8.75806 17H9.24194C9.41704 14.1121 9.79504 12.478 11.1214 11.1214C12.478 9.79504 14.1121 9.41704 17 9.24194Z" />
                  </svg>
                  {/* <svg width="106" height="18" viewBox="0 0 172 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.548 24H12.936V4.53999H8.008C3.052 4.53999 0.448 7.08799 0.448 10.84C0.448 13.836 1.876 15.6 4.424 17.42L0 24H3.668L8.596 16.636L6.888 15.488C4.816 14.088 3.808 12.996 3.808 10.644C3.808 8.57199 5.264 7.17199 8.036 7.17199H9.548V24ZM54.04 23.048V20.332C53.004 21.032 51.268 21.648 49.644 21.648C47.208 21.648 46.284 20.5 46.144 18.148H54.18V16.384C54.18 11.484 52.024 9.63599 48.692 9.63599C44.632 9.63599 42.7 12.744 42.7 17C42.7 21.9 45.108 24.28 49.364 24.28C51.492 24.28 53.06 23.72 54.04 23.048ZM74.872 24.28C76.412 24.28 77.504 24 78.316 23.412V20.696C77.476 21.284 76.468 21.648 75.068 21.648C72.688 21.648 71.708 19.8 71.708 16.888C71.708 13.836 72.912 12.268 75.096 12.268C76.384 12.268 77.644 12.716 78.316 13.136V10.308C77.616 9.91599 76.384 9.63599 74.732 9.63599C70.476 9.63599 68.264 12.688 68.264 16.972C68.264 21.676 70.42 24.28 74.872 24.28ZM23.52 9.91599V15.488H19.068V9.91599H15.736V24H19.068V18.12H23.52V24H26.852V9.91599H23.52ZM41.888 21.368H40.404V9.91599H30.688V11.12C30.688 14.564 30.464 19.016 29.288 21.368H28.252V27.22H31.332V24H38.808V27.22H41.888V21.368ZM64.68 24H68.46L63.112 16.412L67.816 9.91599H64.456L59.752 16.412V9.91599H56.42V24H59.752V17.084L64.68 24ZM48.636 12.268C50.288 12.268 50.792 13.64 50.792 15.404V15.684H46.144C46.228 13.444 47.04 12.268 48.636 12.268ZM37.072 21.368H32.368C33.292 19.24 33.544 15.404 33.544 12.968V12.548H37.072V21.368Z" fill="currentColor"/>
                    <path d="M120.164 28.06V24H129.936V28.06H133.1V21.368H131.28V4.53999H119.94L119.66 12.548C119.52 17.168 119.156 19.884 118.26 21.368H117V28.06H120.164ZM122.628 12.996L122.824 7.17199H127.892V21.368H121.452C122.04 20.024 122.488 17.616 122.628 12.996Z" fill="currentColor"/>
                    <path d="M138.773 21.648C137.065 21.648 135.385 21.032 134.489 20.36V23.076C135.133 23.608 136.757 24.28 139.165 24.28C142.721 24.28 144.597 22.684 144.597 19.856C144.597 18.204 143.561 17.084 141.713 16.692C143.449 16.132 144.177 14.9 144.177 13.332C144.177 10.952 142.301 9.63599 139.277 9.63599C137.093 9.63599 135.665 10.308 134.853 10.812V13.528C135.749 12.94 136.981 12.268 138.801 12.268C140.033 12.268 140.817 12.856 140.817 13.892C140.817 14.984 140.145 15.572 138.773 15.572H136.673V18.092H138.773C140.481 18.092 141.153 18.596 141.153 19.828C141.153 20.948 140.341 21.648 138.773 21.648Z" fill="currentColor"/>
                    <path d="M157.204 23.048V20.332C156.168 21.032 154.432 21.648 152.808 21.648C150.372 21.648 149.448 20.5 149.308 18.148H157.344V16.384C157.344 11.484 155.188 9.63599 151.856 9.63599C147.796 9.63599 145.864 12.744 145.864 17C145.864 21.9 148.272 24.28 152.528 24.28C154.656 24.28 156.224 23.72 157.204 23.048ZM151.8 12.268C153.452 12.268 153.956 13.64 153.956 15.404V15.684H149.308C149.392 13.444 150.204 12.268 151.8 12.268Z" fill="currentColor"/>
                    <path d="M167.36 9.91599V15.488H162.908V9.91599H159.576V24H162.908V18.12H167.36V24H170.692V9.91599H167.36Z" fill="currentColor"/>
                    <path d="M85 14C85 6.8203 90.8203 1 98 1C105.18 1 111 6.8203 111 14C111 21.1797 105.18 27 98 27C90.8203 27 85 21.1797 85 14Z" fill="currentColor"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M97.7369 1C97.6755 6.34828 97.3258 9.34146 95.3336 11.3336C93.3415 13.3258 90.3483 13.6755 85 13.7369V14.5131C90.3483 14.5745 93.3415 14.9242 95.3336 16.9164C97.2945 18.8773 97.6641 21.808 97.7338 27H98.5162C98.5858 21.808 98.9555 18.8773 100.916 16.9164C102.877 14.9555 105.808 14.5858 111 14.5162V13.7338C105.808 13.6641 102.877 13.2945 100.916 11.3336C98.9242 9.34146 98.5745 6.34828 98.5131 1H97.7369Z" fill="white"/>
                  </svg> */}
                </a>
              </div>
            </div>

            <div className="col-span-5 lg:col-span-2 order-first md:order-last">
              <div className="rounded-md shadow overflow-hidden">
                <Image
                  src="/images/about.jpeg"
                  alt=""
                  width={640}
                  height={480}
                  objectFit="cover"
                  layout="responsive"
                />
              </div>
            </div>
          </div>
        </section>

        {renderLatestCooking({
          title: 'Торты, печенье и прочая выпечка',
          data: resultFirstSection?.data
        })}

        {renderLatestCooking({
          title: 'Первые и вторые блюда',
          data: resultSecondSection?.data
        })}

        {renderLatestCooking({
          title: 'Прочая кулинария',
          data: resultThirdSection?.data
        })}
      </div>
    </WideLayout>
  )

  function renderLatestCooking({ data, title }) {
    return (
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-2">
          <h2 className="text-2xl md:text-3xl">{title}</h2>
          <Link href="/cooking" passHref>
            <a className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">
              смотреть все
              <span className="ml-1 text-xl">
                <BsArrowRightShort />
              </span>
            </a>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((article) => (
            <ArticleCardLatest
              key={article.alias}
              name={article.name}
              portionCount={article.portion_count}
              cookingTime={article.cooking_time}
              commentsCount={article.comments_count || 0}
              hitsCount={article.hits_count || 0}
              excerpt={article.excerpt}
              createdAt={DateTime.fromISO(article.date_created)
                .setLocale('ru')
                .toFormat('DDD')}
              thumbnail={
                article.thumbnail
                  ? {
                      name: article.thumbnail?.title,
                      blurHash: article.thumbnail?.blurhash,
                      url: `${publicRuntimeConfig.API_URL}/assets/${article.thumbnail?.filename_disk}`
                    }
                  : undefined
              }
              url={`/${article.category.section.alias}/${article.category.alias}/${article.alias}`}
              category={{
                name: article.category.name,
                url: `/${article.category.section.alias}/${article.category.alias}`
              }}
            />
          ))}
        </div>
      </section>
    )
  }
}
