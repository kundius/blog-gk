import React from 'react'

import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { Container } from '@components/Container'
import { SideAuthor } from '@components/SideAuthor'
import { SubscribeForm } from '@components/SubscribeForm'
import { SideAdvert } from '@components/SideAdvert'
import { SidePopular } from '@components/SidePopular'
import { SideLatest } from '@components/SideLatest'

import styles from './styles.module.css'

export interface MainLayout {
  children?: React.ReactNode
}

export function MainLayout({ children }: MainLayout) {
  return (
    <>
      <Header />
      <Container className="mt-20 mb-20">
        <div className={styles.Main}>
          <div className={styles.Content}>{children}</div>
          <div className={`${styles.Side} flex flex-col gap-24`}>
            <SideAuthor />
            <SideAdvert />
            <SidePopular />
            <SubscribeForm />
            <SideLatest />
          </div>
        </div>
      </Container>
      <Footer />
    </>
  )
}
