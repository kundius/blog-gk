import React from 'react'
import { default as NextImage, ImageProps as NextImageProps } from 'next/image'

import { blurHashToDataUrl } from '@app/utils/blurHashToDataUrl'
import styles from './styles.module.css'

export type ImageProps = Omit<
  NextImageProps,
  'placeholder' | 'blurDataURL' | 'className' | 'layout' | 'objectFit' | 'objectPosition' | 'alt'
> & {
  src?: string
  alt?: string
  blurHash?: string | null
  layout?: 'responsive' | 'fill' | 'fixed' | 'intrinsic'
  objectFit?: string
}

export const Image = ({ blurHash, layout, objectFit, src, alt, ...props }: ImageProps) => {
  const blurDataURL = blurHashToDataUrl(blurHash)
  const imageSrc = src || ''

  if (layout === 'fill') {
    return (
      <NextImage
        className={styles.Element}
        fill
        src={imageSrc}
        alt={alt || ''}
        style={{ objectFit: objectFit as React.CSSProperties['objectFit'] }}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        {...props}
      />
    )
  }

  return (
    <NextImage
      className={styles.Element}
      src={imageSrc}
      alt={alt || ''}
      sizes={props.sizes || '100vw'}
      style={{
        width: '100%',
        height: 'auto',
        objectFit: objectFit as React.CSSProperties['objectFit']
      }}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      {...props}
    />
  )
}
