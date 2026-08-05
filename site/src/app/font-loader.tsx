'use client'

import React, { useEffect } from 'react'

export function FontLoader () {
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

  return null
}
