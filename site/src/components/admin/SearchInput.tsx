'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@app/lib/utils'
import { Input } from '@components/ui/input'

const DEBOUNCE_MS = 400

interface SearchInputProps {
  value: string
  onCommit: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onCommit,
  placeholder = 'Поиск...',
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const scheduleCommit = (next: string) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onCommit(next), DEBOUNCE_MS)
  }

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    setText('')
    onCommit('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          scheduleCommit(e.target.value)
        }}
        placeholder={placeholder}
        className="pl-8 pr-8"
      />
      {text && (
        <button
          type="button"
          onClick={clear}
          aria-label="Очистить"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
