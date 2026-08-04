import React from 'react'
import Link from 'next/link'
import { BsArrowRightShort } from 'react-icons/bs'
import { FaRegComment } from 'react-icons/fa'
import { FiEye } from 'react-icons/fi'

import { Image } from '@components/Image'

import * as styles from './styles.module.css'

export interface ArticleCardLatestProps {
  name: string
  url: string
  createdAt: string
  portionCount?: string
  cookingTime?: string
  commentsCount: number
  hitsCount?: number
  excerpt?: string
  category: {
    name: string
    url: string
  }
  thumbnail?: {
    url: string
    name?: string
    blurHash?: string
  }
}

export function ArticleCardLatest ({
  name,
  url,
  category,
  createdAt,
  commentsCount,
  hitsCount,
  thumbnail,
  excerpt
}: ArticleCardLatestProps) {
  return (
    <div className="relative h-full border-2 border-gray-200 dark:border-gray-600 transition duration-300 ease-out border-opacity-60 rounded-lg overflow-hidden">
      {thumbnail && (
        <Image
          src={thumbnail.url}
          alt={thumbnail.name}
          blurHash={thumbnail.blurHash}
          width={640}
          height={480}
          objectFit="cover"
          layout="responsive"
        />
      )}
      <div className="p-6">
        <Link href={category.url} passHref>
          <a className="uppercase relative z-10 tracking-widest text-xs title-font font-medium text-gray-400 mb-1 hover:text-red-400">{category.name}</a>
        </Link>
        <h3 className="text-xl font-bold leading-tight mb-3 text-gray-800 dark:text-gray-100 transition duration-300 ease-out">
          {name}
        </h3>
        {excerpt && (
          <p className="leading-tight mb-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center flex-wrap">
          <Link href={url} passHref>
            <a className={`${styles.More} text-red-500 items-center md:mb-2 lg:mb-0`}>
              Читать дальше
              <span className="ml-1 text-xl">
                <BsArrowRightShort />
              </span>
            </a>
          </Link>
          <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200 dark:border-gray-600 transition duration-300 ease-out">
            <div className="mr-1">
              <FiEye />
            </div>
            {hitsCount}
          </span>
          <span className="text-gray-400 inline-flex items-center leading-none text-sm">
            <div className="mr-1">
              <FaRegComment />
            </div>
            {commentsCount}
          </span>
        </div>
      </div>
    </div>
  )
}
