'use client'
import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleLayoutLeftProps {
  children: React.ReactNode
}

export function ArticleLayoutLeft ({ children }: ArticleLayoutLeftProps) {
  return <div className={styles.left}>{children}</div>
}
