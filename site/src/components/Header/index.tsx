import React, { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaChevronDown, FaRss } from 'react-icons/fa'

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
  const [showNav, setShowNav] = useState(false)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const barAnchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const anchor = barAnchorRef.current
    const bar = barRef.current
    if (!anchor || !bar) return
    const io = new IntersectionObserver(([entry]) => {
      bar.dataset.barPinned = String(!entry.isIntersecting)
    })
    io.observe(anchor)
    return () => io.disconnect()
  }, [])

  const handleToggleTheme = () => {
    setColorMode?.(colorMode === 'dark' ? 'light' : 'dark')
  }

  const handleToggleNav = () => {
    setShowNav(prev => !prev)
    setExpandedKey(null)
  }

  const handleCloseNav = () => {
    setShowNav(false)
    setExpandedKey(null)
  }

  const handleItemClick = (e: React.MouseEvent, item: MenuItem) => {
    if (!item.children.length || !showNav) return
    if (expandedKey !== item.href) {
      e.preventDefault()
      setExpandedKey(item.href)
    } else {
      handleCloseNav()
    }
  }

  return (
    <>
      <div className={styles.headerTop} />
      <div ref={barRef} className={styles.bar}>
        <Container>
          <div className={styles.barContainer}>
            <div className={cn(styles.nav, {
              [styles.navShow]: showNav
            })}>
              <div className={styles.buttons}>
                {colorMode && (
                  <button className={styles.button} onClick={handleToggleTheme}>
                    {lightToggle}
                  </button>
                )}
                <Link href="/rss" target="_blank" className={styles.button}>
                  <FaRss />
                </Link>
              </div>
              <ul className={styles.menu}>
                {leftItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    item={item}
                    expandedKey={expandedKey}
                    onItemClick={handleItemClick}
                    onNavigate={handleCloseNav}
                  />
                ))}
              </ul>
              <ul className={styles.menu}>
                {rightItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    item={item}
                    expandedKey={expandedKey}
                    onItemClick={handleItemClick}
                    onNavigate={handleCloseNav}
                  />
                ))}
              </ul>
            </div>
            <Link href="/" className={styles.logo}>
              <Image src="/images/logo.png" alt="Блог Галины Кундиус" width={116} height={116} />
            </Link>
            <div className={styles.search}>
              <Search />
            </div>
            <button className={cn(styles.toggle, {
              [styles.toggleActive]: showNav
            })} type="button" onClick={handleToggleNav} />
          </div>
          <div ref={barAnchorRef} className={styles.barAnchor} />
        </Container>
      </div>
      <div className={styles.headerBottom} />
      <div className={styles.slogan}>АВТОРСКИЙ БЛОГ</div>
    </>
  )
}

function MenuItem({
  item,
  expandedKey,
  onItemClick,
  onNavigate
}: {
  item: MenuItem
  expandedKey: string | null
  onItemClick: (e: React.MouseEvent, item: MenuItem) => void
  onNavigate: () => void
}) {
  const isOpen = expandedKey === item.href
  return (
    <li className={cn(styles.menuItem, { [styles.menuItemOpen]: isOpen })}>
      <Link href={item.href} onClick={(e) => onItemClick(e, item)}>
        <span>{item.title}</span>
        {item.children.length > 0 && (
          <span className={styles.arrow}>
            {isOpen ? <span className={styles.dot} /> : <FaChevronDown />}
          </span>
        )}
      </Link>
      <ul className={styles.menuSub}>
        {item.children.map((child) => (
          <li key={child.href}>
            <Link href={child.href} onClick={onNavigate}>
              {child.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}
