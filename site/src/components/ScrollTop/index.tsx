import React from 'react'
import { BsArrowUpShort } from 'react-icons/bs'

import styles from './styles.module.css'

export const ScrollTop = () => {
  return (
    <button
      className={`${styles.ScrollTop} bg-gray-300 dark:bg-gray-700 text-xs uppercase fixed right-2 bottom-2 md:right-8 md:bottom-8 flex flex-col items-center justify-center w-12 h-12`}
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
