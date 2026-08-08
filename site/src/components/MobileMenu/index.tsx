import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { FaRss } from 'react-icons/fa'

import { ThemeContext } from '@components/ThemeContext'
import { useLightToggle } from '@components/Header/useLightToggle'

import styles from './styles.module.css'

interface MenuItem {
  href: string
  title: string
  children: {
    href: string
    title: string
  }[]
}

const menuItems: MenuItem[] = [{
  href: '/first-courses',
  title: 'Первые блюда',
  children: [{
    href: '/entrees',
    title: 'Первые блюда'
  }]
}, {
  href: '/second-courses',
  title: 'Вторые блюда',
  children: [{
    href: '/mjasnye-bljuda',
    title: 'Мясные блюда'
  }, {
    href: '/fish-dishes',
    title: 'Рыбные блюда'
  }, {
    href: '/ovoshhnye-bljuda',
    title: 'Овощные блюда'
  }, {
    href: '/gribnye-blyuda',
    title: 'Грибные блюда'
  }, {
    href: '/kartofelnye-bljuda',
    title: 'Картофельные блюда'
  }, {
    href: '/main-dishes',
    title: 'Вторые блюда'
  }]
}, {
  href: '/vypechka',
  title: 'Выпечка',
  children: [{
    href: '/pirogi',
    title: 'Пироги'
  }, {
    href: '/cookies',
    title: 'Печенье'
  }, {
    href: '/baking',
    title: 'Выпечка'
  }]
}, {
  href: '/salaty-i-zakuski',
  title: 'Салаты и Закуски',
  children: [{
    href: '/salads',
    title: 'Салаты и закуски'
  }]
}, {
  href: '/sladkij-stol',
  title: 'Сладкий стол',
  children: [{
    href: '/cakes',
    title: 'Торты и пирожные'
  }, {
    href: '/drinks',
    title: 'Напитки и десерты'
  }, {
    href: '/krem-i-glazur-dlya-tortov',
    title: 'Крем и глазурь для тортов'
  }]
}, {
  href: '/zagotovki',
  title: 'Заготовки',
  children: [{
    href: '/conservation',
    title: 'Консервация'
  }]
}]

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
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} >{item.title}</Link>
              <ul className={styles.SecondList}>
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} >{child.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
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
