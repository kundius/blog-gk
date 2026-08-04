import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import Script from 'next/script'

import { ThemeProvider } from '@components/ThemeContext'
import '@components/ThemeContext/globals.css'
import '@components/Pagination/styles.css'
import 'react-image-lightbox/style.css'

export default function App ({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('webfontloader').then(({ default: WebFont }) => {
        WebFont.load({
          custom: {
            families: ['Gilroy:n4,i4,n6,n7'],
            urls: ['/fonts/Gilroy/stylesheet.css']
          }
        })
      })
    }
  }, [])

  return (
    <SWRConfig value={{ fallback: pageProps.preloadData || {} }}>
      <ThemeProvider>
        <Script strategy="beforeInteractive" id="ya-context">{`window.yaContextCb=window.yaContextCb||[]`}</Script>
        <Script src="https://yandex.ru/ads/system/context.js" strategy="beforeInteractive" />
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
  )
}
