'use client'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import * as styles from './styles.module.css'
import { IngredientIcon, type IngredientKind, IngredientsIcon, CloseIcon } from './icons'
import { matchKind } from './match'

const STICKY_TOP = 64 + 24
const STICKY_BOTTOM = 24
const MOBILE_QUERY = '(max-width: 1023px)'

export interface ArticleIngredientsProps {
  items: Array<{ name: string; amount?: string | null; value?: string | null }>
}

export function ArticleIngredients ({ items }: ArticleIngredientsProps) {
  const ref = useRef<HTMLElement>(null)
  const [isStatic, setIsStatic] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const available = window.innerHeight - STICKY_TOP - STICKY_BOTTOM
      setIsStatic(el.offsetHeight > available)
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const top = el.getBoundingClientRect().top
      setShowFab(top < 0)
      if (top >= 0) setOpen(false)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  const list = useMemo(() => (
    <ul className={styles.list}>
      {items.map((item, i) => {
        const label = item.amount ?? item.value
        const isHeader = !label
        const kind: IngredientKind | null = isHeader ? null : matchKind(item.name)

        return (
          <li
            key={i}
            className={isHeader ? styles.header : styles.item}
            itemProp="recipeIngredient"
          >
            <span className={styles.left}>
              {!isHeader && kind && <IngredientIcon kind={kind} className={styles.icon} />}
              <span className={isHeader ? styles.headerName : styles.name}>{item.name}</span>
            </span>
            {!isHeader && label && (
              <span className={styles.amount}>{label}</span>
            )}
          </li>
        )
      })}
    </ul>
  ), [items])

  if (!items.length) return null

  const toggle = () => setOpen(o => !o)

  return (
    <>
      <section
        ref={ref}
        className={isStatic ? `${styles.card} ${styles.isStatic}` : styles.card}
      >
        <h2 className={styles.title}>Ингредиенты</h2>
        {list}
      </section>

      {isMobile && showFab && typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className={styles.fab}>
              <button
                className={styles.fabButton}
                onClick={toggle}
                aria-expanded={open}
                aria-label={open ? 'Закрыть ингредиенты' : 'Открыть ингредиенты'}
              >
                <span className={styles.fabIcon}>
                  {open ? <CloseIcon /> : <IngredientsIcon />}
                </span>
                <span className={styles.fabText}>Ингредиенты</span>
              </button>
            </div>

            {open && (
              <div className={styles.popup} role="dialog" aria-modal="true">
                <div className={styles.popupHeader}>
                  <h3 className={styles.popupTitle}>Ингредиенты</h3>
                  <button
                    className={styles.popupClose}
                    onClick={() => setOpen(false)}
                    aria-label="Закрыть ингредиенты"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className={styles.popupBody}>{list}</div>
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  )
}