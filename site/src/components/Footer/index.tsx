import React from 'react'
import { BsBook } from 'react-icons/bs'
import { BiSitemap } from 'react-icons/bi'

import { YandexMetrica } from '@components/YandexMetrica'
import { Container } from '@components/Container'
import { FooterMenu } from '@components/FooterMenu'
import { TablewareIcon } from '@components/Icon/tableware'

import * as styles from './styles.module.css'

export const Footer = () => {
  return (
    <div className={styles.Wrapper}>
      <Container>
        <div className={`${styles.Primary} transition duration-300 ease-out flex flex-wrap lg:flex-nowrap justify-between items-start gap-12 border-t border-gray-200 dark:border-gray-600`}>
          <div>
            <FooterMenu
              section={{
                title: 'Кулинария',
                href: '/baking',
                icon: <TablewareIcon />
              }}
              items={[{
                title: 'Крем и глазурь для тортов',
                href: '/krem-i-glazur-dlya-tortov'
              }, {
                title: 'Торты, пироги и пирожные',
                href: '/cakes'
              }, {
                title: 'Напитки и десерты',
                href: '/drinks'
              }, {
                title: 'Салаты и закуски',
                href: '/salads'
              }, {
                title: 'Консервация',
                href: '/conservation'
              }, {
                title: 'Выпечка',
                href: '/baking'
              }, {
                title: 'Печенье',
                href: '/cookies'
              }, {
                title: 'Вторые блюда',
                href: '/main-dishes'
              }, {
                title: 'Первые блюда',
                href: '/entrees'
              }, {
                title: 'Рыбные блюда',
                href: '/fish-dishes'
              }]}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: 'Альбомы',
                href: '/albums',
                icon: <BsBook />
              }}
              items={[]}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: 'Карта сайта',
                href: '/sitemap',
                icon: <BiSitemap />
              }}
              items={[{
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
            <YandexMetrica id={35935260} />
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
