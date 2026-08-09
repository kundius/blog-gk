'use client'

import React, { useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@app/lib/utils'
import styles from './styles.module.css'

export interface LightboxImage {
  src: string
  alt?: string
}

interface LightboxProps {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const total = images.length

  const prev = useCallback(() => {
    onIndexChange((index - 1 + total) % total)
  }, [index, total, onIndexChange])

  const next = useCallback(() => {
    onIndexChange((index + 1) % total)
  }, [index, total, onIndexChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, prev, next])

  if (total === 0 || !images[index]) return null

  const current = images[index]

  return (
    <div className={styles.Overlay} onClick={onClose} role="dialog" aria-modal="true">
      <button
        type="button"
        className={styles.Close}
        onClick={onClose}
        aria-label="Закрыть"
      >
        <X className="size-6" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            className={cn(styles.Nav, styles.NavLeft)}
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Предыдущая"
          >
            <ChevronLeft className="size-8" />
          </button>
          <button
            type="button"
            className={cn(styles.Nav, styles.NavRight)}
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Следующая"
          >
            <ChevronRight className="size-8" />
          </button>
        </>
      )}

      <div className={styles.Stage} onClick={(e) => e.stopPropagation()}>
        <figure className={styles.Fig} key={index}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt || ''} className={styles.Image} />
          {current.alt && <figcaption className={styles.Caption}>{current.alt}</figcaption>}
        </figure>
      </div>

      {total > 1 && (
        <div className={styles.Counter}>
          {index + 1} / {total}
        </div>
      )}
    </div>
  )
}
