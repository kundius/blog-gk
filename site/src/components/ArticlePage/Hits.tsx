import React from 'react'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import { EyeIcon } from '@components/Icon/eye'

const { publicRuntimeConfig } = getRuntimeConfig()

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
    // Invoke the function by making a request.
    // Update the URL to match the format of your platform.
    fetch(`${publicRuntimeConfig.API_URL}/custom/articles/${id}/register-hit`)
      .then((res) => res.json())
      .then((json) => {
        if (typeof json.data === 'number') {
          setHits(json.data)
        }
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
