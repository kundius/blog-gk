'use client'
import React from 'react'

import * as styles from './styles.module.css'

export interface ArticleLayoutBottomProps {
  children: React.ReactNode
}

export function ArticleLayoutBottom ({ children }: ArticleLayoutBottomProps) {
  return <div className={styles.bottom}>{children}</div>
}
