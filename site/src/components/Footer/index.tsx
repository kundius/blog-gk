'use client'
import React from 'react'
import { Book, CookingPot, Map } from 'lucide-react'
import useSWR from 'swr'

import { YandexMetrica } from '@components/YandexMetrica'
import { Container } from '@components/Container'
import { FooterMenu } from '@components/FooterMenu'

import { categoriesTree } from '@app/api/categories'
import type { CategoryWithChildren } from '@app/api/types'

import * as styles from './styles.module.css'

export const Footer = () => {
  const [key, fetcher] = categoriesTree()
  const { data } = useSWR<{ data: CategoryWithChildren[] }>(key, fetcher)
  const roots = data?.data ?? []

  const cooking = roots.find((c) => c.alias === 'cooking')
  const article = roots.find((c) => c.alias === 'article')
  const notes = roots.find((c) => c.alias === 'notes')

  const toItems = (category?: CategoryWithChildren) => (category?.children ?? []).map((child) => ({
    title: child.name,
    href: `/${child.alias}`
  }))

  return (
    <div className={styles.Wrapper}>
      <Container>
        <div className={`${styles.Primary} transition duration-300 ease-out flex flex-wrap lg:flex-nowrap justify-between items-start gap-12`}>
          <div>
            <FooterMenu
              section={{
                title: cooking?.name ?? 'Кулинария',
                href: '/cooking',
                icon: <CookingPot />
              }}
              items={toItems(cooking)}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: article?.name ?? 'Статьи',
                href: '/article',
                icon: <Book />
              }}
              items={toItems(article)}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: notes?.name ?? 'Заметки',
                href: '/notes',
                icon: <Book />
              }}
              items={toItems(notes)}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: 'Страницы',
                href: '/sitemap',
                icon: <Map />
              }}
              items={[{
                title: 'Обо мне',
                href: '/about'
              }, {
                title: 'Альбомы',
                href: '/albums'
              }, {
                title: 'Подборки',
                href: '/collections'
              }, {
                title: 'Карта сайта',
                href: '/sitemap'
              }, {
                title: 'Политика конфиденциальности',
                href: '/privacy-policy'
              }, {
                title: 'Пользовательское соглашение',
                href: '/user-agreement'
              }]}
            />
          </div>
        </div>
        <div className={`${styles.Secondary} transition duration-300 ease-out border-t border-gray-200 dark:border-gray-600`}>
          <div className={`${styles.Copyright} text-gray-700 dark:text-gray-400`}>
            © {new Date().getFullYear()} Блог Галины Кундиус - Все о вкусной еде.<br />
            Копирование материалов сайта возможно только с&nbsp;указанием активной действующей ссылки на&nbsp;источник.
          </div>
          <div>
            {/*<YandexMetrica id={35935260} />*/}
          </div>
          <a
            href="http://domenart-studio.ru/"
            className={`${styles.Creator} text-gray-700 dark:text-gray-400`}
            target="_blank"
          >
            <span>
              Разработка, поддержка и продвижение<br />
              веб-студии <b>ДоменАРТ</b>
            </span>
          </a>
        </div>
      </Container>
    </div>
  )
}
