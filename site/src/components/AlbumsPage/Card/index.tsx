import React from 'react'
import Link from 'next/link'

import { Image } from '@components/Image'
import { BsImage } from 'react-icons/bs'

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
        <figure className={styles.Thumbnail}>
          <Image
            src={thumbnail.url}
            alt={thumbnail.name}
            blurHash={thumbnail.blurHash}
            width={350}
            height={420}
            objectFit="cover"
            layout="responsive"
          />
        </figure>
      )}
      {!thumbnail && (
        <figure className={`${styles.ThumbnailPlaceholder} transition duration-300 ease-out bg-gray-200 dark:bg-gray-600`}>
          <BsImage />
        </figure>
      )}
      <div className={styles.Inner}>
        <Link href={href} passHref>
          <div className={styles.Name}>{name}</div>
        </Link>
      </div>
    </div>
  )
}
