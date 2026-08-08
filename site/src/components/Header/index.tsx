import React, { useContext } from 'react'
import Link from 'next/link'
import { FaRss } from 'react-icons/fa'

import { Container } from '@components/Container'
import { ThemeContext } from '@components/ThemeContext'

import { useLightToggle } from './useLightToggle'
import { Search } from './Search'
import styles from './styles.module.css'
import { cn } from '@app/lib/utils'
import Image from 'next/image'

interface MenuItem {
  href: string
  title: string
  children: {
    href: string
    title: string
  }[]
}

const leftItems: MenuItem[] = [
  {
    href: '/first-courses',
    title: 'Первые блюда',
    children: [
      {
        href: '/entrees',
        title: 'Первые блюда'
      }
    ]
  },
  {
    href: '/second-courses',
    title: 'Вторые блюда',
    children: [
      {
        href: '/mjasnye-bljuda',
        title: 'Мясные блюда'
      },
      {
        href: '/fish-dishes',
        title: 'Рыбные блюда'
      },
      {
        href: '/ovoshhnye-bljuda',
        title: 'Овощные блюда'
      },
      {
        href: '/gribnye-blyuda',
        title: 'Грибные блюда'
      },
      {
        href: '/kartofelnye-bljuda',
        title: 'Картофельные блюда'
      },
      {
        href: '/main-dishes',
        title: 'Вторые блюда'
      }
    ]
  },
  {
    href: '/vypechka',
    title: 'Выпечка',
    children: [
      {
        href: '/pirogi',
        title: 'Пироги'
      },
      {
        href: '/cookies',
        title: 'Печенье'
      },
      {
        href: '/baking',
        title: 'Выпечка'
      }
    ]
  }
]

const rightItems: MenuItem[] = [
  {
    href: '/salaty-i-zakuski',
    title: 'Салаты и Закуски',
    children: [
      {
        href: '/salads',
        title: 'Салаты и закуски'
      }
    ]
  },
  {
    href: '/sladkij-stol',
    title: 'Сладкий стол',
    children: [
      {
        href: '/cakes',
        title: 'Торты и пирожные'
      },
      {
        href: '/drinks',
        title: 'Напитки и десерты'
      },
      {
        href: '/krem-i-glazur-dlya-tortov',
        title: 'Крем и глазурь для тортов'
      }
    ]
  },
  {
    href: '/zagotovki',
    title: 'Заготовки',
    children: [
      {
        href: '/conservation',
        title: 'Консервация'
      }
    ]
  }
]

export const Header = () => {
  const { colorMode, setColorMode } = useContext(ThemeContext)
  const lightToggle = useLightToggle({ theme: colorMode })

  const handleToggleTheme = () => {
    setColorMode?.(colorMode === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <div className={styles.headerTop} />
      <div className={styles.bar}>
        <Container>
          <div className={styles.barContainer}>
            <div className={styles.nav}>
              <ul className={styles.menu}>
                {leftItems.map((item) => (
                  <React.Fragment key={item.href}>
                    {renderMenuItem(item)}
                  </React.Fragment>
                ))}
              </ul>
              <ul className={styles.menu}>
                {rightItems.map((item) => (
                  <React.Fragment key={item.href}>
                    {renderMenuItem(item)}
                  </React.Fragment>
                ))}
              </ul>
            </div>
            <Link href="/" className={styles.logo}>
              <Image src="/images/logo.png" alt="Блог Галины Кундиус" width={116} height={116} />
            </Link>
            <div className={styles.slogan}>АВТОРСКИЙ БЛОГ</div>
            <div className={cn(styles.buttons, styles.buttonsLeft)}>
              <Search />
            </div>
            <div className={cn(styles.buttons, styles.buttonsRight)}>
              {colorMode && (
                <button className={styles.button} onClick={handleToggleTheme}>
                  {lightToggle}
                </button>
              )}
              <a href="/rss" target="_blank">
                <button className={styles.button}>
                  <FaRss />
                </button>
              </a>
            </div>
          </div>
          <div className={styles.barAnchor} />
        </Container>
      </div>
      <div className={styles.headerBottom} />
    </>
  )
}

function renderMenuItem(item: MenuItem) {
  return (
    <li>
      <Link href={item.href}>
        <span>{item.title}</span>
      </Link>
      <ul className={styles.menuSub}>
        {item.children.map((child) => (
          <li key={child.href}>
            <Link href={child.href}>{child.title}</Link>
          </li>
        ))}
      </ul>
    </li>
  )
}
