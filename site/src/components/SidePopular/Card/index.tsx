import { DateTime } from 'luxon'
import React, { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'

import * as api from '../api'
import styles from './styles.module.css'
import { CoverImage } from '@components/CoverImage'

export interface CardProps {
  name: string
  href: string
  createdAt: string
  category: {
    name: string
    href: string
  }
  thumbnail?: {
    name?: string
    blurHash?: string
    url: string
  }
}

export const Card = ({
  name,
  href,
  createdAt,
  category,
  thumbnail
}: CardProps) => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Category}>
        <Link href={category.href}>{category.name}</Link>
      </div>
      {thumbnail && (
        <Link href={href}>
          <div className={`${styles.Thumbnail} relative`}>
            <CoverImage
              src={thumbnail.url}
              alt={thumbnail.name || ''}
              blurHash={thumbnail.blurHash}
              sizes="240px"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      <div className={styles.Title}>
        <Link href={href}>{name}</Link>
      </div>
      <div className={`${styles.Date} text-gray-400`}>
        {createdAt}
      </div>
    </div>
  )
}
