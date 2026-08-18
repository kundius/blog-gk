import React from 'react'
import Link from 'next/link'

import { breadcrumbCategories } from '@app/lib/breadcrumbs'
import type { ArticleCategory } from '@app/api/types'

export interface ArticleBreadcrumbsProps {
  category: Pick<ArticleCategory, 'name' | 'alias' | 'ancestors'>
}

export function ArticleBreadcrumbs ({ category }: ArticleBreadcrumbsProps) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-400 dark:text-stone-400"
      itemScope
      itemType="http://schema.org/BreadcrumbList"
    >
      <span
        itemProp="itemListElement"
        itemScope
        itemType="http://schema.org/ListItem"
      >
        <Link
          href="/"
          itemProp="item"
          className="transition-colors hover:text-[#d36d6d]"
        >
          <span itemProp="name">Главная</span>
        </Link>
        <meta itemProp="position" content="1" />
      </span>
      {breadcrumbCategories(category).map((item, index) => (
        <React.Fragment key={item.alias}>
          <span className="text-gray-300 dark:text-stone-600">/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="http://schema.org/ListItem"
          >
            <Link
              href={`/${item.alias}`}
              itemProp="item"
              className="transition-colors hover:text-[#d36d6d]"
            >
              <span itemProp="name">{item.name}</span>
            </Link>
            <meta itemProp="position" content={String(index + 2)} />
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}