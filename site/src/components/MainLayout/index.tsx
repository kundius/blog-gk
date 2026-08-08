import React from 'react'

import { SideAuthor } from '@components/SideAuthor'
import { SubscribeForm } from '@components/SubscribeForm'
import { SidePopular } from '@components/SidePopular'
import { SideLatest } from '@components/SideLatest'

import styles from './styles.module.css'

export interface MainLayout {
  children?: React.ReactNode
}

export function MainLayout({ children }: MainLayout) {
  return (
    <div className={styles.Main}>
      <div className={styles.Content}>{children}</div>
      <div className={`${styles.Side} flex flex-col gap-24`}>
        <SideAuthor />
        <SidePopular />
        <SubscribeForm />
        <SideLatest />
      </div>
    </div>
  )
}
