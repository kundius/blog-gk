import React from 'react'
import Link from 'next/link'

import * as styles from './styles.module.css'

export interface ArticleBreadcrumbsProps {
  categoryName: string
  categoryAlias: string
}

export function ArticleBreadcrumbs ({
  categoryName,
  categoryAlias
}: ArticleBreadcrumbsProps) {
  return (
    <nav
      className={styles.breadcrumbs}
      itemScope
      itemType="http://schema.org/BreadcrumbList"
    >
      <span
        itemProp="itemListElement"
        itemScope
        itemType="http://schema.org/ListItem"
      >
        <Link href="/" itemProp="item">
          <span itemProp="name">Главная</span>
        </Link>
        <meta itemProp="position" content="1" />
      </span>
      <span className={styles.sep}>/</span>
      <span
        itemProp="itemListElement"
        itemScope
        itemType="http://schema.org/ListItem"
      >
        <Link href={`/${categoryAlias}`} itemProp="item">
          <span itemProp="name">{categoryName}</span>
        </Link>
        <meta itemProp="position" content="2" />
      </span>
      <span className={styles.sep}>/</span>
    </nav>
  )
}