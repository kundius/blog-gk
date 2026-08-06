'use client'

import React, { useMemo, useState } from 'react'
import { ChevronsUpDown, Star } from 'lucide-react'
import type { CategoryRecord } from '@app/lib/admin/types'
import { cn } from '@app/lib/utils'
import { Badge } from '@components/ui/badge'
import { Checkbox } from '@components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command'

interface FlattenedCategory {
  id: string
  name: string
  depth: number
}

function flattenTree(nodes: CategoryRecord[], depth = 0): FlattenedCategory[] {
  const out: FlattenedCategory[] = []
  for (const node of nodes) {
    out.push({ id: node.id, name: node.name, depth })
    if (node.children?.length) out.push(...flattenTree(node.children, depth + 1))
  }
  return out
}

interface CategoryMultiSelectProps {
  categories: CategoryRecord[]
  value: string[]
  onChange: (ids: string[]) => void
  primaryId?: string
  onPrimaryChange?: (id: string) => void
}

export function CategoryMultiSelect({
  categories,
  value,
  onChange,
  primaryId,
  onPrimaryChange,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const options = useMemo(() => flattenTree(categories), [categories])
  const selectedMap = useMemo(() => new Set(value), [value])

  const toggle = (id: string) => {
    if (selectedMap.has(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  const handlePrimary = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (id !== primaryId) onPrimaryChange?.(id)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          className="flex min-h-9 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {value.length === 0 ? (
            <span className="text-muted-foreground">Выберите категории</span>
          ) : (
            value.map((id) => {
              const cat = options.find((c) => c.id === id)
              const isPrimary = id === primaryId
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className={cn(
                    'h-6 gap-1 pr-1 pl-1.5 text-xs',
                    isPrimary && 'border-amber-400/60 bg-amber-400/15',
                  )}
                >
                  {cat?.name ?? id}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={
                          isPrimary ? 'Основная категория' : 'Сделать основной'
                        }
                        onClick={(e) => handlePrimary(e, id)}
                        className={cn(
                          'shrink-0 rounded-sm p-0.5 outline-none transition-colors hover:bg-amber-400/20 focus-visible:ring-2 focus-visible:ring-amber-400/60',
                          isPrimary
                            ? 'text-amber-400'
                            : 'text-muted-foreground hover:text-amber-400',
                        )}
                      >
                        <Star
                          className={cn('size-3', isPrimary && 'fill-amber-400')}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isPrimary
                        ? 'Основная категория'
                        : 'Сделать основной'}
                    </TooltipContent>
                  </Tooltip>
                </Badge>
              )
            })
          )}
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Поиск категории..." />
          <CommandList>
            <CommandEmpty>Ничего не найдено</CommandEmpty>
            <CommandGroup>
              {options.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={cat.name}
                  onSelect={() => toggle(cat.id)}
                  data-checked={selectedMap.has(cat.id) || undefined}
                >
                  <Checkbox
                    checked={selectedMap.has(cat.id)}
                    onCheckedChange={() => toggle(cat.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mr-1"
                  />
                  <span className="text-muted-foreground">
                    {'—'.repeat(cat.depth)}
                  </span>{' '}
                  {cat.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
