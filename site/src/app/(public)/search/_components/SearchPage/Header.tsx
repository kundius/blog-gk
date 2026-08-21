import React from 'react'
import Link from 'next/link'

import { SearchForm } from '@components/HomeSearch/SearchForm'

export interface SearchHeaderProps {
  query: string
}

export function SearchHeader({ query }: SearchHeaderProps) {
  return (
    <header className="hero-surface rounded-[24px] py-5 px-6 md:py-7 md:px-8 lg:py-10 lg:px-12">
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
        <span className="text-gray-300 dark:text-stone-600">/</span>
        <span
          itemProp="itemListElement"
          itemScope
          itemType="http://schema.org/ListItem"
        >
          <span
            itemProp="name"
            className="text-gray-600 dark:text-stone-200"
          >
            {`Поиск «${query || '...'}»`}
          </span>
          <meta itemProp="position" content="2" />
        </span>
      </nav>

      <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-800 md:text-5xl lg:text-6xl dark:text-stone-100">
        Поиск
      </h1>

      <div className="mx-auto mt-6 max-w-[640px]">
        <SearchForm initialQuery={query} />
      </div>
    </header>
  )
}
