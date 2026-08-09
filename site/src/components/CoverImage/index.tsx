import Image from 'next/image'
import type { ImageProps } from 'next/image'

import { cn } from '@app/lib/utils'
import { blurHashToDataUrl } from '@app/utils/blurHashToDataUrl'

export type CoverImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'> & {
  blurHash?: string | null
}

export function CoverImage({
  blurHash,
  className,
  fill = true,
  objectFit = 'cover',
  ...props
}: CoverImageProps) {
  const blurDataURL = blurHashToDataUrl(blurHash)

  return (
    <Image
      {...props}
      fill={fill}
      objectFit={objectFit}
      className={cn('object-cover', className)}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
    />
  )
}
