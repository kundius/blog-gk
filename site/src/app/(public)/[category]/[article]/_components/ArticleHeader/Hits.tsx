import React from 'react'
import { API_URL } from '@app/utils/config'
import { postJson } from '@app/api/http'

import { formatHits } from './format'
import * as styles from './styles.module.css'

export interface HitsProps {
  id: string
  initialHits: number
}

export function Hits ({ id, initialHits }: HitsProps) {
  const [hits, setHits] = React.useState(initialHits)

  React.useEffect(() => {
    postJson(`${API_URL}/api/articles/${id}/hit`)
      .then((data) => {
        if (typeof data?.data?.hitsCount === 'number') {
          setHits(data.data.hitsCount)
        }
      })
      .catch(() => {
        // ignore request errors, keep current count
      })
  }, [id])

  return (
    <div className={styles.item}>
      <svg className={styles.metaIcon} viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{formatHits(hits)}</span>
    </div>
  )
}