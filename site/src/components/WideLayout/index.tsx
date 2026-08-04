import React from 'react'

import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { Container } from '@components/Container'

export interface WideLayout {
  children?: React.ReactNode
}

export function WideLayout ({
  children
}: WideLayout) {
  return (
    <>
      <Header />
      <Container className="mt-20 mb-20">
        {children}
      </Container>
      <Footer />
    </>
  )
}
