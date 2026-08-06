import React from 'react'
import Link from 'next/link'

import { Popover } from '@components/Popover'

import styles from './styles.module.css'

export const HeaderMenu = () => {
  return (
    <div className={styles.Wrapper}>
      <ul className={styles.List}>
        <li>
          <Link href="/about" >Обо мне</Link>
        </li>
        <Popover
          content={
            <ul className={styles.SecondList}>
              <li>
                <Link href="/krem-i-glazur-dlya-tortov" >Крем и глазурь для тортов</Link>
              </li>
              <li>
                <Link href="/pirogi" >Пироги</Link>
              </li>
              <li>
                <Link href="/cakes" >Торты и пирожные</Link>
              </li>
              <li>
                <Link href="/kartofelnye-bljuda" >Картофельные блюда</Link>
              </li>
              <li>
                <Link href="/ovoshhnye-bljuda" >Овощные блюда</Link>
              </li>
              <li>
                <Link href="/mjasnye-bljuda" >Мясные блюда</Link>
              </li>
              <li>
                <Link href="/gribnye-blyuda" >Грибные блюда</Link>
              </li>
              <li>
                <Link href="/drinks" >Напитки и десерты</Link>
              </li>
              <li>
                <Link href="/salads" >Салаты и закуски</Link>
              </li>
              <li>
                <Link href="/conservation" >Консервация</Link>
              </li>
              <li>
                <Link href="/baking" >Выпечка</Link>
              </li>
              <li>
                <Link href="/cookies" >Печенье</Link>
              </li>
              <li>
                <Link href="/main-dishes" >Вторые блюда</Link>
              </li>
              <li>
                <Link href="/entrees" >Первые блюда</Link>
              </li>
              <li>
                <Link href="/fish-dishes" >Рыбные блюда</Link>
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
      <Link href="/" className={styles.Logo}>
          <img src="/images/logo.png" alt="" />
        </Link>
      <ul className={styles.List}>
        <li>
          <Link href="/albums" >Альбомы</Link>
        </li>
        <li>
          <Link href="/sitemap" >Карта сайта</Link>
        </li>
      </ul>
    </div>
  )
}
