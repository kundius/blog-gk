import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { FaRss } from 'react-icons/fa'

import { ThemeContext } from '@components/ThemeContext'
import { useLightToggle } from '@components/Header/useLightToggle'

import styles from './styles.module.css'

export const MobileMenu = () => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  const { colorMode, setColorMode } = useContext(ThemeContext)
  const lightToggle = useLightToggle({ theme: colorMode })

  const handleToggleTheme = () => {
    setColorMode?.(colorMode === 'dark' ? 'light' : 'dark')
  }

  const handleToggleMenu = () => {
    setIsShowMenu(prev => !prev)
  }

  return (
    <>
      <div className={`${styles.Drawer} ${isShowMenu ? styles.DrawerIsVisible : ''}`}>
        <ul className={styles.List}>
          <li>
            <Link href="/pages/about" passHref>
              <a>Обо мне</a>
            </Link>
          </li>
          <li>
            <Link href="/krem-i-glazur-dlya-tortov" passHref>
              <a>Кулинария</a>
            </Link>
            <ul className={styles.SecondList}>
              <li>
                <Link href="/krem-i-glazur-dlya-tortov" passHref>
                  <a>Крем и глазурь для тортов</a>
                </Link>
              </li>
              <li>
                <Link href="/cakes" passHref>
                  <a>Торты, пироги и пирожные</a>
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
          </li>
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
        <div className={styles.Buttons}>
          {colorMode && (
            <button className={styles.Button} onClick={handleToggleTheme}>
              {lightToggle}
            </button>
          )}
          <a href="/rss" target="_blank">
            <button className={styles.Button}>
              <FaRss />
            </button>
          </a>
        </div>
      </div>
      <button
        className={`${styles.Toggle} ${isShowMenu ? styles.ToggleIsActive : ''}`}
        onClick={handleToggleMenu}
      />
    </>
  )
}
