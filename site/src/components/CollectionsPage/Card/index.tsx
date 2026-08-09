import React from 'react'
import Link from 'next/link'
import { BsBook } from 'react-icons/bs'
import { CoverImage } from '@components/CoverImage'

export interface CardProps {
  name: string
  href: string
  description?: string | null
  count?: number
  thumbnail?: {
    url: string
    name?: string
    blurHash?: string
  }
}

function pluralRecipes(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'рецепт'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'рецепта'
  return 'рецептов'
}

export function Card ({
  name,
  href,
  description,
  count,
  thumbnail
}: CardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:gap-5"
    >
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden sm:w-36">
        {thumbnail ? (
          <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:[transform:scale(1.03)]">
            <CoverImage
              src={thumbnail.url}
              alt={thumbnail.name || name}
              blurHash={thumbnail.blurHash}
              sizes="(max-width: 768px) 80px, 144px"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-200 transition duration-300 ease-out dark:bg-gray-600">
            <BsBook className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={40} />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-4 pr-4 sm:py-5 sm:pr-6">
        <h3 className="text-lg font-semibold leading-snug sm:text-2xl">{name}</h3>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:mt-2 sm:text-base">
            {description}
          </p>
        )}
        {count !== undefined && count > 0 && (
          <div className="mt-2 sm:mt-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80 sm:text-base">
              <BsBook className="text-primary" size={16} strokeWidth={1} />
              {count} {pluralRecipes(count)}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
