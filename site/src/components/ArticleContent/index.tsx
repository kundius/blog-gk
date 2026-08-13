'use client'

import React, { useCallback, useState } from 'react'
import { Content } from '@components/Content'
import { Ingredients } from '@components/Ingredients'
import { Lightbox, type LightboxImage } from '@components/Lightbox'
import {
  INGREDIENTS_MARKER_RE,
  hasIngredientsMarker,
} from '@app/lib/tiptap/constants'

interface ArticleContentProps {
  html: string
  ingredients?: Array<{ name: string; amount?: string; value?: string }> | null
  itemProp?: string
}

export function ArticleContent({ html, ingredients, itemProp }: ArticleContentProps) {
  const [lightbox, setLightbox] = useState<{
    images: LightboxImage[]
    index: number
  } | null>(null)

  const hasMarker = hasIngredientsMarker(html)
  const hasIngredients = Array.isArray(ingredients) && ingredients.length > 0

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (!(target instanceof HTMLImageElement)) return

    const galleryEl = target.closest('.gallery')
    const stepEl = target.closest('.recipe-step')

    let images: HTMLImageElement[]
    if (galleryEl) {
      images = Array.from(galleryEl.querySelectorAll('img'))
    } else if (stepEl) {
      images = Array.from(stepEl.querySelectorAll('img')).filter(
        (img) => !img.closest('.gallery'),
      )
    } else {
      images = [target]
    }

    const index = images.indexOf(target)
    if (index === -1) return

    setLightbox({
      images: images.map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt || undefined,
      })),
      index,
    })
  }, [])

  const segments = html.split(INGREDIENTS_MARKER_RE)

  return (
    <>
      <Content itemProp={itemProp} onClick={handleContentClick}>
        {segments.map((segment, i) => (
          <React.Fragment key={i}>
            {segment ? (
              <div dangerouslySetInnerHTML={{ __html: segment }} />
            ) : null}
            {hasMarker && hasIngredients && i < segments.length - 1 && (
              <Ingredients items={ingredients} />
            )}
          </React.Fragment>
        ))}
      </Content>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndexChange={(index) =>
            setLightbox((prev) => (prev ? { ...prev, index } : prev))
          }
        />
      )}
    </>
  )
}
