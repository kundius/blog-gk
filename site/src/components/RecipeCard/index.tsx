import React from 'react'
import Link from 'next/link'
import { Clock, Eye, MessageCircle } from 'lucide-react'

import { fileUrl } from '@app/api/images'
import type { ArticleListItem } from '@app/api/types'
import { CoverImage } from '@components/CoverImage'

function formatHits(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(count)
}

function formatCookingTime(value?: string | null) {
  const total = Number(value)
  if (!value || Number.isNaN(total)) return null
  if (total < 60) return `${total} мин`
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (minutes === 0) return `${hours} ч`
  return `${hours} ч ${minutes} мин`
}

export function RecipeCard({ article }: { article: ArticleListItem }) {
  const { name, alias, excerpt, cookingTime, hitsCount, commentsCount, category, thumbnail } =
    article
  const timeLabel = formatCookingTime(cookingTime)

  return (
    <Link
      href={`/${category.alias}/${alias}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        {thumbnail ? (
          <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:[transform:scale(1.03)]">
            <CoverImage
              src={fileUrl(thumbnail) ?? ''}
              alt={thumbnail.title || name}
              blurHash={thumbnail.blurhash}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold leading-snug sm:text-lg">{name}</h3>
          {excerpt && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2 sm:text-sm">
              {excerpt}
            </p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3 text-foreground/80 sm:gap-4 sm:pt-4">
          {timeLabel && (
            <span className="inline-flex items-center gap-1 text-xs sm:gap-1.5 sm:text-sm">
              <Clock className="text-primary" size={14} strokeWidth={2} />
              {timeLabel}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-2 sm:gap-4">
            {commentsCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs sm:gap-1.5 sm:text-sm">
                <MessageCircle className="text-primary" size={14} strokeWidth={2} />
                {commentsCount}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs sm:gap-1.5 sm:text-sm">
              <Eye className="text-primary" size={14} strokeWidth={2} />
              {formatHits(hitsCount)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
