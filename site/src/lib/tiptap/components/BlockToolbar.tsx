'use client'

import type { ReactNode } from 'react'
import { GripVertical, Trash2 } from 'lucide-react'

interface BlockToolbarProps {
  onDelete: () => void
  children?: ReactNode
  visibleClassName?: string
}

export function BlockToolbar({ onDelete, children, visibleClassName }: BlockToolbarProps) {
  return (
    <div
      contentEditable={false}
      className={`invisible absolute top-0 right-4 z-10 flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-background p-0.5 opacity-0 shadow-md transition-opacity ${
        visibleClassName ?? 'group-hover:visible group-hover:opacity-100'
      }`}
    >
      {children}
      <div
        draggable
        data-drag-handle
        title="Перетащить блок"
        className="flex size-6 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-3.5" />
      </div>
      <button
        type="button"
        title="Удалить блок"
        className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}
