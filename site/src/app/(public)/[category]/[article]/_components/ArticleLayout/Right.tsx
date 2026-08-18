'use client'
import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleLayoutRightProps {
  children: React.ReactNode
  wide?: boolean
}

export function ArticleLayoutRight ({ children, wide = false }: ArticleLayoutRightProps) {
  const className = wide ? `${styles.right} ${styles.rightWide}` : styles.right
  return <div className={className}>{children}</div>
}
