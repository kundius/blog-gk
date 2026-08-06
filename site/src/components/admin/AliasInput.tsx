'use client'

import React from 'react'
import { Wand2 } from 'lucide-react'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { slugify } from '@app/lib/admin/client'

interface AliasInputProps {
  value: string
  onChange: (value: string) => void
  name?: string
}

export function AliasInput({ value, onChange, name }: AliasInputProps) {
  const generate = () => {
    const source = name?.trim()
    if (source) onChange(slugify(source))
  }

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="alias (латиницей)"
        dir="ltr"
      />
      <Button type="button" variant="outline" onClick={generate}>
        <Wand2 className="size-4" />
        Из имени
      </Button>
    </div>
  )
}
