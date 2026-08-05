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
            <Link href="/pages/about" >Обо мне</Link>
          </li>
          <li>
            <Link href="/krem-i-glazur-dlya-tortov" >Кулинария</Link>
            <ul className={styles.SecondList}>
              <li>
                <Link href="/krem-i-glazur-dlya-tortov" >Крем и глазурь для тортов</Link>
              </li>
              <li>
                <Link href="/cakes" >Торты, пироги и пирожные</Link>
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
          </li>
          <li>
            <Link href="/albums" >Альбомы</Link>
          </li>
          <li>
            <Link href="/sitemap" >Карта сайта</Link>
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
