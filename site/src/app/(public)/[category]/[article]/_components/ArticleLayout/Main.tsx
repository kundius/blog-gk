'use client'
import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleLayoutMainProps {
  children: React.ReactNode
}

export function ArticleLayoutMain ({ children }: ArticleLayoutMainProps) {
  return <div className={styles.main}>{children}</div>
}
