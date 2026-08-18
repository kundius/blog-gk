'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import * as styles from './styles.module.css'

export interface SearchFormProps {
  initialQuery?: string
  placeholder?: string
}

export const SearchForm = ({
  initialQuery = '',
  placeholder = 'Например: борщ, торт Наполеон, заготовки на зиму'
}: SearchFormProps) => {
  const router = useRouter()
  const [phrase, setPhrase] = useState(initialQuery)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = phrase.trim()
    if (query) {
      router.push(`/search/${query}`)
    }
  }

  return (
    <form className={styles.SearchForm} role="search" onSubmit={handleSubmit}>
      <div className={styles.SearchWrapper}>
        <Search className={styles.SearchIcon} size={20} strokeWidth={2} />
        <input
          className={styles.SearchInput}
          type="search"
          placeholder={placeholder}
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
        <button className={styles.SearchButton} type="submit">
          Найти
        </button>
      </div>
    </form>
  )
}
