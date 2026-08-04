import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaSearch } from 'react-icons/fa'
import { useSpring, animated, useSpringRef, useChain } from 'react-spring'

import styles from './styles.module.css'

export const Search = () => {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState(false)
  const [search, setSearch] = useState('')
  const fieldAnimateFirstRef = useSpringRef()
  const fieldAnimateFirst = useSpring({
    config: {
      mass: 1,
      tension: 180,
      friction: 21
    },
    scale: opened ? 1 : 0,
    ref: fieldAnimateFirstRef
  })
  const fieldAnimateSecondRef = useSpringRef()
  const fieldAnimateSecond = useSpring({
    config: {
      mass: 1,
      tension: 180,
      friction: 21
    },
    w: opened ? 15 : 0,
    pr: opened ? 1 : 0,
    ref: fieldAnimateSecondRef
  })
  useChain([fieldAnimateFirstRef, fieldAnimateSecondRef], opened ? [0, 0.25] : [0.15, 0])

  const handleButtonCick = () => {
    if (!opened) {
      setOpened(true)
      fieldRef.current?.focus()
    } else {
      router.push(`/search/${search}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/search/${search}`)
  }

  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setOpened(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={styles.Wrapper}
      ref={wrapperRef}
      onSubmit={handleSubmit}
    >
      <animated.input
        className={styles.Field}
        ref={fieldRef}
        style={{
          transform: fieldAnimateFirst.scale.to(scale => `scale(${scale})`),
          width: fieldAnimateSecond.w.to(w => `${w}rem`),
          paddingRight: fieldAnimateSecond.pr.to(pr => `${pr}rem`)
        }}
        placeholder="Что будем искать?"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button
        className={styles.Button}
        type="button"
        onClick={handleButtonCick}
      >
        <FaSearch />
      </button>
    </div>
  )
}
