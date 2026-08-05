import React from 'react'
import { API_URL } from '@app/utils/config'
import { postJson } from '@app/api/http'

import { EyeIcon } from '@components/Icon/eye'

export interface HitsProps {
  id: string
  initialHits: number
}

export function Hits ({
  id,
  initialHits
}: HitsProps) {
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

  if (typeof hits === 'undefined') {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <div className="transition duration-300 ease-out text-lg text-gray-600 dark:text-gray-200">
        <EyeIcon />
      </div>
      <div className="text-xs uppercase">
        {hits}
      </div>
    </div>
  )
}
