import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaSearch } from 'react-icons/fa'

import styles from './styles.module.css'

export interface FormProps {
  query: string
}

export const Form = ({
  query
}: FormProps) => {
  const router = useRouter()
  const fieldRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(query)

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/search/${value}`)
  }

  useEffect(() => {
    setValue(query)
  }, [query])

  return (
    <form className={styles.Wrapper} onSubmit={handleSubmit}>
      <label className={styles.Label}>
        Искать
      </label>
      <div className="relative w-full">
        <input
          className={styles.Field}
          ref={fieldRef}
          placeholder="Что будем искать?"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button
          className={styles.Button}
          type="submit"
        >
          <FaSearch />
        </button>
        <div className={styles.Help}>
          Например, правильное питание
        </div>
      </div>
    </form>
  )
}
