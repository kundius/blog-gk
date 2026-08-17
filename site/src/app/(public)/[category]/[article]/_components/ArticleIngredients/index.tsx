'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'

import * as styles from './styles.module.css'
import { IngredientIcon, type IngredientKind } from './icons'
import { matchKind } from './match'

const STICKY_TOP = 64 + 24
const STICKY_BOTTOM = 24

export interface ArticleIngredientsProps {
  items: Array<{ name: string; amount?: string | null; value?: string | null }>
}

export function ArticleIngredients ({ items }: ArticleIngredientsProps) {
  const ref = useRef<HTMLElement>(null)
  const [isStatic, setIsStatic] = useState(false)

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

  if (!items.length) return null

  return (
    <section
      ref={ref}
      className={isStatic ? `${styles.card} ${styles.isStatic}` : styles.card}
    >
      <h2 className={styles.title}>Ингредиенты</h2>
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
    </section>
  )
}