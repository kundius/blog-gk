'use client'

import React from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'

export interface IngredientItem {
  name: string
  amount: string
}

interface IngredientsEditorProps {
  items: IngredientItem[]
  onChange: (items: IngredientItem[]) => void
}

export function IngredientsEditor({ items, onChange }: IngredientsEditorProps) {
  const update = (index: number, patch: Partial<IngredientItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  const add = () => onChange([...items, { name: '', amount: '' }])

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index))

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item.name}
            placeholder="Название"
            onChange={(e) => update(index, { name: e.target.value })}
            className="flex-1"
          />
          <Input
            value={item.amount}
            placeholder="Количество"
            onChange={(e) => update(index, { amount: e.target.value })}
            className="w-32"
          />
          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => move(index, -1)}
              disabled={index === 0}
            >
              <ArrowUp className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
            >
              <ArrowDown className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => remove(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="size-4" />
        Добавить ингредиент
      </Button>
    </div>
  )
}
