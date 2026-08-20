import React from 'react'
import { Eye } from 'lucide-react'
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
    <div className={styles.item} title="Просмотры">
      <Eye className={styles.metaIcon} />
      <span>{formatHits(hits)}</span>
    </div>
  )
}