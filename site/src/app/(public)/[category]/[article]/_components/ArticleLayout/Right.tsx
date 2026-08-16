'use client'
import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleLayoutRightProps {
  children: React.ReactNode
}

export function ArticleLayoutRight ({ children }: ArticleLayoutRightProps) {
  return <div className={styles.right}>{children}</div>
}
