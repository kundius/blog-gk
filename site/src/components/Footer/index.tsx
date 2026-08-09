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
                href: '/cooking',
                icon: <TablewareIcon />
              }}
              items={[{
                title: 'Первые блюда',
                href: '/first-courses'
              }, {
                title: 'Вторые блюда',
                href: '/second-courses'
              }, {
                title: 'Выпечка',
                href: '/vypechka'
              }, {
                title: 'Салаты и Закуски',
                href: '/salaty-i-zakuski'
              }, {
                title: 'Сладкий стол',
                href: '/sladkij-stol'
              }, {
                title: 'Заготовки',
                href: '/zagotovki'
              }]}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: 'Статьи',
                href: '/article',
                icon: <BsBook />
              }}
              items={[{
                title: 'Храмы',
                href: '/temples'
              }, {
                title: 'Жизненные истории',
                href: '/subsection-2'
              }, {
                title: 'Отношения',
                href: '/relationship'
              }, {
                title: 'Сверхъестественное',
                href: '/supernatural'
              }]}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: 'Заметки',
                href: '/notes',
                icon: <BsBook />
              }}
              items={[{
                title: 'Заметки о первых блюдах',
                href: '/zametki-o-pervyh-blyudah'
              }, {
                title: 'Заметки о вторых блюдах',
                href: '/zametki-o-vtoryh-blyudah'
              }, {
                title: 'Заметки о выпечке',
                href: '/zametki-o-vypechke'
              }, {
                title: 'Заметки о напитках',
                href: '/zametki-o-napitkah'
              }, {
                title: 'Полезные советы',
                href: '/useful-tips'
              }]}
            />
          </div>
          <div>
            <FooterMenu
              section={{
                title: 'Страницы',
                href: '/sitemap',
                icon: <BiSitemap />
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
