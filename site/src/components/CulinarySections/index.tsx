'use client'
import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { categoriesTree } from '@app/api/categories'
import { fileUrl } from '@app/api/images'
import { Container } from '@components/Container'
import { CoverImage } from '@components/CoverImage'
import type { CategoryWithChildren } from '@app/api/types'

const decorEmojis = [
  { emoji: '🌿', className: 'left-[3%] top-[8%] text-5xl -rotate-12 opacity-25' },
  { emoji: '🍅', className: 'right-[5%] top-[10%] text-6xl rotate-12 opacity-20' },
  { emoji: '🧄', className: 'left-[8%] bottom-[12%] text-4xl rotate-6 opacity-25' },
  { emoji: '🌶️', className: 'right-[10%] top-[45%] text-5xl -rotate-6 opacity-20' },
  { emoji: '🥕', className: 'left-[15%] top-[35%] text-5xl rotate-12 opacity-20' },
  { emoji: '🍋', className: 'right-[4%] bottom-[8%] text-4xl rotate-45 opacity-25' },
  { emoji: '🫑', className: 'left-[2%] top-[65%] text-4xl -rotate-6 opacity-20' },
  { emoji: '🌽', className: 'right-[18%] top-[75%] text-5xl rotate-6 opacity-20' },
  { emoji: '🍇', className: 'left-[20%] bottom-[4%] text-4xl -rotate-12 opacity-25' },
  { emoji: '🧀', className: 'right-[25%] top-[25%] text-5xl -rotate-6 opacity-20' },
  { emoji: '🥑', className: 'left-[30%] top-[12%] text-4xl rotate-6 opacity-20' },
  { emoji: '🍆', className: 'right-[30%] bottom-[18%] text-5xl rotate-12 opacity-20' },
  { emoji: '🥬', className: 'right-[40%] top-[3%] text-5xl rotate-6 opacity-20' },
  { emoji: '🧅', className: 'left-[55%] bottom-[10%] text-4xl rotate-12 opacity-25' },
  { emoji: '🍊', className: 'right-[8%] top-[60%] text-5xl -rotate-12 opacity-20' }
]

export function CulinarySections() {
  const [key, fetcher] = categoriesTree()
  const { data } = useSWR<{ data: CategoryWithChildren[] }>(key, fetcher)

  const cooking = data?.data?.find((c) => c.alias === 'cooking')
  const sections = cooking?.children ?? []

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden select-none md:block"
      >
        {decorEmojis.map(({ emoji, className }) => (
          <span
            key={emoji}
            className={`absolute ${className}`}
            style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <Container>
        <div className="relative z-10 mb-6 text-center md:mb-10">
          <h2 className="text-2xl md:text-4xl">Кулинарные разделы</h2>
          <div
            className="mx-auto mt-3 h-1 w-14 rounded-full"
            style={{ backgroundColor: 'var(--main-color)' }}
          />
        </div>

        <div className="relative z-10">
          {!data ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse aspect-[4/3] overflow-hidden rounded-[20px] bg-muted"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`/${section.alias}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
                >
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:[transform:scale(1.06)]">
                      {section.thumbnail?.filenameDisk ? (
                        <CoverImage
                          src={fileUrl(section.thumbnail.filenameDisk)}
                          alt={section.thumbnail.title || section.name}
                          blurHash={section.thumbnail.blurhash}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 from-20% to-transparent to-70% opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                    <h3 className="text-lg font-semibold leading-tight text-white sm:text-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
                      {section.name}
                    </h3>
                    {section.content && (
                      <p className="hidden max-h-0 translate-y-1.5 overflow-hidden text-sm leading-snug opacity-0 transition-all duration-300 group-hover:mt-1.5 group-hover:max-h-[60px] group-hover:translate-y-0 group-hover:opacity-100 sm:block sm:text-base [text-shadow:0_1px_5px_rgba(0,0,0,0.3)]">
                        {section.content}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
