'use client'

import React from 'react'
import { cn } from '@app/lib/utils'
import { blurHashToDataUrl } from '@app/utils/blurHashToDataUrl'

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  blurHash?: string | null
}

export function BlurImage({ blurHash, className, style, ...props }: BlurImageProps) {
  const blurUrl = blurHashToDataUrl(blurHash)

  return (
    <img
      className={cn(className)}
      style={{
        ...(blurUrl
          ? {
              backgroundImage: `url(${blurUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}),
        ...style,
      }}
      {...props}
    />
  )
}
