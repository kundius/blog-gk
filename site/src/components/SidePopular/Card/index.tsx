import { DateTime } from 'luxon'
import React, { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { Image } from '@components/Image'
import Skeleton from 'react-loading-skeleton'

import * as api from '../api'
import styles from './styles.module.css'

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
        <Link href={category.href} passHref>
          <a>{category.name}</a>
        </Link>
      </div>
      {thumbnail && (
        <Link href={href}>
          <div className={styles.Thumbnail}>
            <Image
              src={thumbnail.url}
              alt={thumbnail.name}
              blurHash={thumbnail.blurHash}
              width={240}
              height={240}
              objectFit="cover"
              layout="responsive"
            />
          </div>
        </Link>
      )}
      <div className={styles.Title}>
        <Link href={href} passHref>
          <a>{name}</a>
        </Link>
      </div>
      <div className={`${styles.Date} text-gray-400`}>
        {createdAt}
      </div>
    </div>
  )
}
