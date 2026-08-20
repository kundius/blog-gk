import React from 'react'
import Link from 'next/link'
import { Book } from 'lucide-react'
import { CoverImage } from '@components/CoverImage'
import { pluralRecipes } from '@app/lib/plural'

export interface CardProps {
  name: string
  href: string
  description?: string | null
  count?: number
  thumbnail?: {
    url: string | undefined
    name?: string
    blurHash?: string
  }
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
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden sm:w-36">
        {thumbnail ? (
          <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:[transform:scale(1.03)]">
            <CoverImage
              src={thumbnail.url ?? ''}
              alt={thumbnail.name || name}
              blurHash={thumbnail.blurHash}
              sizes="(max-width: 768px) 96px, 144px"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-200 transition duration-300 ease-out dark:bg-gray-600">
            <Book className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={40} />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-4 sm:py-4 sm:pr-5">
        <h3 className="truncate text-base font-semibold leading-snug sm:text-lg">{name}</h3>
        {description && (
          <p className="mt-1 truncate text-xs leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-sm">
            {description}
          </p>
        )}
        {count !== undefined && count > 0 && (
          <div className="mt-2 flex sm:mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80 sm:text-sm">
              <Book className="text-primary" size={16} strokeWidth={1} />
              {count} {pluralRecipes(count)}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
