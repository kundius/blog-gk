import React from 'react'
import Link from 'next/link'

import { Popover } from '@components/Popover'

import styles from './styles.module.css'

export const HeaderMenu = () => {
  return (
    <div className={styles.Wrapper}>
      <ul className={styles.List}>
        <li>
          <Link href="/pages/about" passHref>
            <a>Обо мне</a>
          </Link>
        </li>
        <Popover
          content={
            <ul className={styles.SecondList}>
              <li>
                <Link href="/krem-i-glazur-dlya-tortov" passHref>
                  <a>Крем и глазурь для тортов</a>
                </Link>
              </li>
              <li>
                <Link href="/pirogi" passHref>
                  <a>Пироги</a>
                </Link>
              </li>
              <li>
                <Link href="/cakes" passHref>
                  <a>Торты и пирожные</a>
                </Link>
              </li>
              <li>
                <Link href="/kartofelnye-bljuda" passHref>
                  <a>Картофельные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/ovoshhnye-bljuda" passHref>
                  <a>Овощные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/mjasnye-bljuda" passHref>
                  <a>Мясные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/gribnye-blyuda" passHref>
                  <a>Грибные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/drinks" passHref>
                  <a>Напитки и десерты</a>
                </Link>
              </li>
              <li>
                <Link href="/salads" passHref>
                  <a>Салаты и закуски</a>
                </Link>
              </li>
              <li>
                <Link href="/conservation" passHref>
                  <a>Консервация</a>
                </Link>
              </li>
              <li>
                <Link href="/baking" passHref>
                  <a>Выпечка</a>
                </Link>
              </li>
              <li>
                <Link href="/cookies" passHref>
                  <a>Печенье</a>
                </Link>
              </li>
              <li>
                <Link href="/main-dishes" passHref>
                  <a>Вторые блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/entrees" passHref>
                  <a>Первые блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/fish-dishes" passHref>
                  <a>Рыбные блюда</a>
                </Link>
              </li>
            </ul>
          }
          showClose={false}
          wrapperStyle={{
            maxWidth: 400
          }}
        >
          {({ setReferenceElement, clickListeners, hoverListeners }) => (
            <li>
              <a {...hoverListeners}>Кулинария</a>
              <button
                className={styles.Dropdown}
                ref={setReferenceElement}
                {...clickListeners}
              />
            </li>
          )}
        </Popover>
      </ul>
      <Link href="/" passHref>
        <a className={styles.Logo}>
          <img src="/images/logo.png" alt="" />
        </a>
      </Link>
      <ul className={styles.List}>
        <li>
          <Link href="/albums" passHref>
            <a>Альбомы</a>
          </Link>
        </li>
        <li>
          <Link href="/sitemap" passHref>
            <a>Карта сайта</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
