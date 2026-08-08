import React, { useEffect, useState } from 'react'
import { BsArrowUpShort } from 'react-icons/bs'

import styles from './styles.module.css'

export const ScrollTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <button
      className={`${styles.ScrollTop} ${visible ? styles.ScrollTopVisible : ''} bg-gray-300 dark:bg-gray-700 text-xs uppercase fixed right-2 bottom-2 md:right-8 md:bottom-8 flex flex-col items-center justify-center w-12 h-12`}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }}
    >
      <span className="text-xl">
        <BsArrowUpShort />
      </span>
      Наверх
    </button>
  )
}
