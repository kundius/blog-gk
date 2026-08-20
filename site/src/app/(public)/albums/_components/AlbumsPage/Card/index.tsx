import React from 'react'
import Link from 'next/link'
import { Image } from 'lucide-react'
import { CoverImage } from '@components/CoverImage'

export interface CardProps {
  name: string
  href: string
  thumbnail?: {
    url: string | undefined
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
    <Link
      href={href}
      className="group relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:[transform:scale(1.06)]">
          {thumbnail ? (
            <CoverImage
              src={thumbnail.url ?? ''}
              alt={thumbnail.name || ''}
              blurHash={thumbnail.blurHash}
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Image className="text-6xl" />
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 from-20% to-transparent to-70% opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        <h3 className="text-lg font-semibold leading-tight text-white sm:text-2xl [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
          {name}
        </h3>
      </div>
    </Link>
  )
}
