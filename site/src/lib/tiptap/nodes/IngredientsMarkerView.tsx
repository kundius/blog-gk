'use client'

import React, { useEffect, useRef } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { UtensilsCrossed, Trash2, GripVertical } from 'lucide-react'

export function IngredientsMarkerView({ deleteNode, editor, getPos }: NodeViewProps) {
  const getPosRef = useRef(getPos)
  getPosRef.current = getPos

  const gripRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const grip = gripRef.current
    if (!grip) return
    const onMouseDown = () => {
      const pos = getPosRef.current()
      if (pos != null) editor.commands.setNodeSelection(pos)
    }
    grip.addEventListener('mousedown', onMouseDown)
    return () => grip.removeEventListener('mousedown', onMouseDown)
  }, [editor])

  return (
    <NodeViewWrapper className="ingredients-marker" contentEditable={false}>
      <div
        ref={gripRef}
        className="ingredients-marker__grip"
        draggable
        title="Перетащить блок"
      >
        <GripVertical className="size-4" />
      </div>
      <div className="ingredients-marker__icon">
        <UtensilsCrossed className="size-5" />
      </div>
      <div className="ingredients-marker__text">
        <div className="ingredients-marker__title">Ингредиенты</div>
        <div className="ingredients-marker__hint">
          Блок появится на этом месте в статье
        </div>
      </div>
      <button
        type="button"
        className="ingredients-marker__delete"
        title="Удалить"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => deleteNode()}
      >
        <Trash2 className="size-4" />
      </button>
    </NodeViewWrapper>
  )
}
