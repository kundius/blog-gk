import React from 'react'

import { ArticleLikes } from '../ArticleLikes'

import * as styles from './styles.module.css'

export interface LikeButtonProps {
  id: string
  initialLikes?: number
}

export function LikeButton ({ id, initialLikes }: LikeButtonProps) {
  return (
    <ArticleLikes
      id={id}
      initialLikes={initialLikes}
      className={styles.metaLike}
    />
  )
}