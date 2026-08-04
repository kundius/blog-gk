import React from 'react'
import classNames from 'classnames'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import { Spinner } from '@components/Spinner'
import { HeartIcon } from '@components/Icon/heart'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface ArticleLikesProps {
  id: string
}

export function ArticleLikes({ id }: ArticleLikesProps) {
  const [loading, setLoadng] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [active, setActive] = React.useState(false)

  const run = async (action) => {
    setLoadng(true)
    const response = await fetch(
      `${publicRuntimeConfig.API_URL}/custom/articles/${id}/${action}`
    )
    const data = await response.json()
    if (typeof data.data === 'number') {
      setCount(data.data)
    }
    setLoadng(false)
  }

  const getStoredIDs = () => {
    const storedLikes = localStorage.getItem('likes') || ''
    return storedLikes.split(',')
  }

  const handler = async () => {
    const arrayOfIds = getStoredIDs()
    const currentIndex = arrayOfIds.indexOf(id)
    if (currentIndex !== -1) {
      await run('likes/remove')
      arrayOfIds.splice(currentIndex, 1)
      setActive(false)
    } else {
      await run('likes/add')
      arrayOfIds.push(id)
      setActive(true)
    }
    localStorage.setItem('likes', arrayOfIds.join(','))
  }

  const init = async () => {
    await run('likes/count')
    setActive(getStoredIDs().includes(id))
  }

  React.useEffect(() => {
    init()
  }, [id])

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
