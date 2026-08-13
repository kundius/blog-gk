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
      className={`block-toolbar ${visibleClassName ?? ''}`.trim()}
    >
      {children}
      <div
        draggable
        data-drag-handle
        title="Перетащить блок"
        className="block-toolbar__drag"
      >
        <GripVertical />
      </div>
      <button
        type="button"
        title="Удалить блок"
        className="block-toolbar__delete"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onDelete}
      >
        <Trash2 />
      </button>
    </div>
  )
}
