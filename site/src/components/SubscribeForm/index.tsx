import React, { useState, useRef } from 'react'

import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

const { publicRuntimeConfig } = getRuntimeConfig()

export function SubscribeForm () {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const timer = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (timer.current) {
      clearTimeout(timer.current)
    }

    const response = await fetch(`${publicRuntimeConfig.API_URL}/custom/articles/register-subscriber?email=${value}`)
    const json = await response.json()

    if (json.success) {
      setValue('')
      setSuccess(json.message)
    } else {
      setError(json.message)
    }

    timer.current = setTimeout(() => {
      setError('')
      setSuccess('')
    }, 4000)
  }

  return (
    <div className="transition duration-300 ease-out space-y-6 bg-gray-50 p-8 rounded border border-gray-300 dark:bg-gray-600 dark:border-gray-500">
      <div className="text-center text-2xl font-semibold tracking-wide">
        Подписаться
      </div>

      {error && (
        <div className="text-center text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="text-center text-yellow-600 dark:text-yellow-600">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <input
          type="email"
          name="email"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Е-mail"
          className="block w-full rounded border border-gray-300 px-6 h-12 bg-white text-black"
          required
        />
        <button
          type="submit"
          name="goodnews-subscription-btn"
          value="Subscribe"
          className="block w-full rounded bg-red-400 text-white uppercase px-6 h-16 text-center hover:bg-red-600"
        >
          Отправить
        </button>
      </form>
    </div>
  )
}
