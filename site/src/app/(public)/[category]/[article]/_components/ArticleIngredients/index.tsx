import React from 'react'

import * as styles from './styles.module.css'
import { IngredientIcon, type IngredientKind } from './icons'
import { matchKind } from './match'

export interface ArticleIngredientsProps {
  items: Array<{ name: string; amount?: string | null; value?: string | null }>
}

export function ArticleIngredients ({ items }: ArticleIngredientsProps) {
  if (!items.length) return null

  return (
    <section className={styles.card}>
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