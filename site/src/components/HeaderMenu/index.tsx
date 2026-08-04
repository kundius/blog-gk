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
                <Link href="/cooking/krem-i-glazur-dlya-tortov" passHref>
                  <a>Крем и глазурь для тортов</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/pirogi" passHref>
                  <a>Пироги</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/cakes" passHref>
                  <a>Торты и пирожные</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/kartofelnye-bljuda" passHref>
                  <a>Картофельные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/ovoshhnye-bljuda" passHref>
                  <a>Овощные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/mjasnye-bljuda" passHref>
                  <a>Мясные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/gribnye-blyuda" passHref>
                  <a>Грибные блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/cakes" passHref>
                  <a>Торты, пироги и пирожные</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/drinks" passHref>
                  <a>Напитки и десерты</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/salads" passHref>
                  <a>Салаты и закуски</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/conservation" passHref>
                  <a>Консервация</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/baking" passHref>
                  <a>Выпечка</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/cookies" passHref>
                  <a>Печенье</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/main-dishes" passHref>
                  <a>Вторые блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/entrees" passHref>
                  <a>Первые блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/cooking/fish-dishes" passHref>
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
              <Link href="/cooking" passHref>
                <a {...hoverListeners}>Кулинария</a>
              </Link>
              <button
                className={styles.Dropdown}
                ref={setReferenceElement}
                {...clickListeners}
              />
            </li>
          )}
        </Popover>
        <li>
          <Link href="/article/temples" passHref>
            <a>Храмы</a>
          </Link>
        </li>
      </ul>
      <Link href="/" passHref>
        <a className={styles.Logo}>
          <img src="/images/logo.png" alt="" />
        </a>
      </Link>
      <ul className={styles.List}>
        <Popover
          content={
            <ul className={styles.SecondList}>
              <li>
                <Link href="/notes/zametki-o-vtoryh-blyudah" passHref>
                  <a>Вторые блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/notes/zametki-o-vypechke" passHref>
                  <a>Выпечка</a>
                </Link>
              </li>
              <li>
                <Link href="/notes/zametki-o-pervyh-blyudah" passHref>
                  <a>Первые блюда</a>
                </Link>
              </li>
              <li>
                <Link href="/notes/useful-tips" passHref>
                  <a>Полезные советы</a>
                </Link>
              </li>
              <li>
                <Link href="/notes/zametki-o-napitkah" passHref>
                  <a>Заметки о напитках</a>
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
              <Link href="/notes" passHref>
                <a {...hoverListeners}>Заметки</a>
              </Link>
              <button
                className={styles.Dropdown}
                ref={setReferenceElement}
                {...clickListeners}
              />
            </li>
          )}
        </Popover>
        <Popover
          content={
            <ul className={styles.SecondList}>
              <li>
                <Link href="/article/supernatural" passHref>
                  <a>Сверхъестественное</a>
                </Link>
              </li>
              <li>
                <Link href="/article/relationship" passHref>
                  <a>Отношения</a>
                </Link>
              </li>
              <li>
                <Link href="/article/subsection-2" passHref>
                  <a>Жизненные истории</a>
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
              <Link href="/article" passHref>
                <a {...hoverListeners}>Статьи</a>
              </Link>
              <button
                className={styles.Dropdown}
                ref={setReferenceElement}
                {...clickListeners}
              />
            </li>
          )}
        </Popover>
        <li>
          <Link href="/albums" passHref>
            <a>Альбомы</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
