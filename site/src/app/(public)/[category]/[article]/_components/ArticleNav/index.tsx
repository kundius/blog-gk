import React from 'react'
import Link from 'next/link'

import * as styles from './styles.module.css'

export interface ArticleNavItem {
  href: string
  name: string
}

export interface ArticleNavProps {
  prev?: ArticleNavItem | null
  next?: ArticleNavItem | null
  isRecipe?: boolean
}

export function ArticleNav ({ prev, next, isRecipe = false }: ArticleNavProps) {
  if (!prev && !next) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.nav}>
        {prev && (
          <Link href={prev.href} rel="prev" className={styles.card}>
            <div className={styles.label}>{isRecipe ? '← Предыдущий рецепт' : '← Предыдущая статья'}</div>
            <div className={styles.title}>{prev.name}</div>
          </Link>
        )}
        {next && (
          <Link href={next.href} rel="next" className={styles.card}>
            <div className={styles.label}>{isRecipe ? 'Следующий рецепт →' : 'Следующая статья →'}</div>
            <div className={styles.title}>{next.name}</div>
          </Link>
        )}
      </div>
    </div>
  )
}