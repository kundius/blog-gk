'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaRss } from 'react-icons/fa'
import useSWR from 'swr'

import { Container } from '@components/Container'
import { ThemeContext } from '@components/ThemeContext'

import { useLightToggle } from './useLightToggle'
import { Search } from './Search'
import styles from './styles.module.css'
import { cn } from '@app/lib/utils'
import Image from 'next/image'
import { categoriesTree } from '@app/api/categories'
import type { CategoryWithChildren } from '@app/api/types'

interface MenuItem {
  href: string
  title: string
  children: {
    href: string
    title: string
  }[]
}

const toMenuItem = (category: CategoryWithChildren): MenuItem => ({
  href: `/${category.alias}`,
  title: category.name,
  children: (category.children ?? []).map((child) => ({
    href: `/${child.alias}`,
    title: child.name
  }))
})

export const Header = () => {
  const { colorMode, setColorMode } = useContext(ThemeContext)
  const lightToggle = useLightToggle({ theme: colorMode })
  const [showNav, setShowNav] = useState(false)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const barAnchorRef = useRef<HTMLDivElement>(null)

  const [key, fetcher] = categoriesTree()
  const { data } = useSWR<{ data: CategoryWithChildren[] }>(key, fetcher)
  const cooking = data?.data?.find((c) => c.alias === 'cooking')
  const items = (cooking?.children ?? []).map(toMenuItem)
  const leftItems = items.slice(0, 3)
  const rightItems = items.slice(3)

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
              <ul className={cn(styles.menu, styles.menuLeft)}>
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
              <ul className={cn(styles.menu, styles.menuRight)}>
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
      <Link
        href={item.href}
        onClick={(e) => onItemClick(e, item)}
        className={item.children.length > 0 ? styles.hasChildren : undefined}
      >
        <span>{item.title}</span>
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
