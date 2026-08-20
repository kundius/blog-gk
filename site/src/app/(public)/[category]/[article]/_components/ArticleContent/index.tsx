'use client'

import React, { useCallback } from 'react'
import { Content } from '@components/Content'
import { useLightbox } from '@components/Lightbox'

interface ArticleContentProps {
  html: string
  itemProp?: string
}

export function ArticleContent ({ html, itemProp }: ArticleContentProps) {
  const { open } = useLightbox()

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (!(target instanceof HTMLImageElement)) return
    open(target)
  }, [open])

  return (
    <Content itemProp={itemProp} onClick={handleContentClick}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Content>
  )
}
