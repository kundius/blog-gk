import React from 'react'
import classNames from 'classnames'

import styles from './styles.module.css'

export interface SpinnerProps {
  className?: string
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <svg className={classNames(styles.Spinner, className)} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
    </svg>
  )
}
