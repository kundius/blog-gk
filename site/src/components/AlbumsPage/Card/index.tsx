import React from 'react'
import Link from 'next/link'
import { BsImage } from 'react-icons/bs'
import { CoverImage } from '@components/CoverImage'

import * as styles from './styles.module.css'

export interface CardProps {
  name: string
  href: string
  thumbnail?: {
    url: string
    name?: string
    blurHash?: string
  }
}

export function Card ({
  name,
  href,
  thumbnail
}: CardProps) {
  return (
    <div className={styles.Wrapper}>
      {thumbnail && (
        <figure className={`${styles.Thumbnail} aspect-[5/6] overflow-hidden`}>
          <CoverImage
            src={thumbnail.url}
            alt={thumbnail.name || ''}
            blurHash={thumbnail.blurHash}
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
          />
        </figure>
      )}
      {!thumbnail && (
        <figure className={`${styles.ThumbnailPlaceholder} transition duration-300 ease-out bg-gray-200 dark:bg-gray-600`}>
          <BsImage />
        </figure>
      )}
      <div className={styles.Inner}>
        <Link href={href}>
          <div className={styles.Name}>{name}</div>
        </Link>
      </div>
    </div>
  )
}
