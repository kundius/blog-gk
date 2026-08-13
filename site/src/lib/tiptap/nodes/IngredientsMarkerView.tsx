'use client'

import React, { useEffect, useRef } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { UtensilsCrossed } from 'lucide-react'

export function IngredientsMarkerView({ editor, getPos }: NodeViewProps) {
  const getPosRef = useRef(getPos)
  getPosRef.current = getPos

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const pos = getPosRef.current()
      if (pos != null) editor.commands.setNodeSelection(pos)
    }
    wrapper.addEventListener('mousedown', onMouseDown)
    return () => wrapper.removeEventListener('mousedown', onMouseDown)
  }, [editor])

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className="ingredients-marker"
      contentEditable={false}
    >
      <div className="ingredients-marker__icon">
        <UtensilsCrossed className="size-5" />
      </div>
      <div className="ingredients-marker__text">
        <div className="ingredients-marker__title">Ингредиенты</div>
        <div className="ingredients-marker__hint">
          Блок появится на этом месте в статье
        </div>
      </div>
    </NodeViewWrapper>
  )
}
