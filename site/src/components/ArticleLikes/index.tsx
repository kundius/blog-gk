import React from 'react'
import classNames from 'classnames'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { postJson, deleteJson } from '@app/api/http'

import { Spinner } from '@components/Spinner'
import { HeartIcon } from '@components/Icon/heart'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface ArticleLikesProps {
  id: string
  initialLikes?: number
}

export function ArticleLikes({ id, initialLikes = 0 }: ArticleLikesProps) {
  const [loading, setLoading] = React.useState(false)
  const [count, setCount] = React.useState(initialLikes)
  const [active, setActive] = React.useState(false)

  const getStoredIDs = () => {
    const storedLikes = localStorage.getItem('likes') || ''
    return storedLikes.split(',').filter(Boolean)
  }

  const run = async (action: 'add' | 'remove') => {
    setLoading(true)
    try {
      const url = `${publicRuntimeConfig.API_URL}/api/articles/${id}/like`
      const data =
        action === 'add' ? await postJson(url) : await deleteJson(url)
      if (typeof data?.data?.likesCount === 'number') {
        setCount(data.data.likesCount)
      }
    } catch {
      // ignore request errors, keep current count
    } finally {
      setLoading(false)
    }
  }

  const handler = async () => {
    const arrayOfIds = getStoredIDs()
    const currentIndex = arrayOfIds.indexOf(id)
    if (currentIndex !== -1) {
      await run('remove')
      arrayOfIds.splice(currentIndex, 1)
      setActive(false)
    } else {
      await run('add')
      arrayOfIds.push(id)
      setActive(true)
    }
    localStorage.setItem('likes', arrayOfIds.join(','))
  }

  React.useEffect(() => {
    setCount(initialLikes)
    setActive(getStoredIDs().includes(id))
  }, [id, initialLikes])

  return (
    <button
      className="flex items-center gap-8 p-0 border-0 bg-transparent"
      onClick={handler}
      disabled={loading}
    >
      <span className="flex items-center gap-2">
        <span
          className={classNames('transition duration-300 ease-out text-lg', {
            'text-gray-600 dark:text-gray-200': !active,
            'text-red-400': active
          })}
        >
          {loading ? <Spinner /> : <HeartIcon filled={active} />}
        </span>
        <span className="text-xs uppercase">{count}</span>
      </span>
    </button>
  )
}
