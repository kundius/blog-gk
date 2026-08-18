'use client'
import React from 'react'
import Link from 'next/link'

import { SearchForm } from './SearchForm'
import * as styles from './styles.module.css'

export const HomeSearch = () => {
  return (
    <section className={styles.Search}>
      <SearchForm />

      <div className={styles.PopularQueries}>
        <span className={styles.PopularLabel}>Часто ищут:</span>
        {[
          { name: 'Борщ', url: '/search/борщ' },
          { name: 'Торт', url: '/search/торт' },
          { name: 'Заготовки', url: '/search/заготовки' },
          { name: 'Салат', url: '/search/салат' },
          { name: 'Пирог', url: '/search/пирог' }
        ].map(({ name, url }) => (
          <Link key={url} href={url} className={styles.QueryChip}>
            {name}
          </Link>
        ))}
      </div>
    </section>
  )
}
