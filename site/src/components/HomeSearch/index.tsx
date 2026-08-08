'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import * as styles from './styles.module.css'

export const HomeSearch = () => {
  const router = useRouter()
  const [phrase, setPhrase] = useState('')

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = phrase.trim()
    if (query) {
      router.push(`/search/${query}`)
    }
  }

  return (
    <section className={styles.Search}>
      <form
        className={styles.SearchForm}
        role="search"
        onSubmit={handleSearchSubmit}
      >
        <div className={styles.SearchWrapper}>
          <svg
            className={styles.SearchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.514 16.506M19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className={styles.SearchInput}
            type="search"
            placeholder="Например: борщ, торт Наполеон, заготовки на зиму"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
          <button className={styles.SearchButton} type="submit">
            Найти
          </button>
        </div>
      </form>

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
