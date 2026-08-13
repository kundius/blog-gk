'use client'

import React, { useEffect, useRef } from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'

export function RecipeStepsView({ node, editor, getPos }: NodeViewProps) {
  const getPosRef = useRef(getPos)
  getPosRef.current = getPos

  const wrapperRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const content = wrapper.querySelector('[data-node-view-content]')
    const header = wrapper.querySelector('.recipe-steps__header')
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement
      if (content && content.contains(target)) return
      if (target.closest && target.closest('button')) return
      const pos = getPosRef.current()
      if (pos != null) {
        editor.commands.setNodeSelection(pos)
        editor.commands.focus()
      }
      if (header && header.contains(target)) {
        e.stopPropagation()
      } else {
        e.preventDefault()
      }
    }
    wrapper.addEventListener('mousedown', onMouseDown)
    return () => wrapper.removeEventListener('mousedown', onMouseDown)
  }, [editor])

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      as="section"
      className="recipe-steps"
      data-recipe-steps
    >
      <div
        className="recipe-steps__header"
        contentEditable={false}
        draggable
        data-drag-handle
        title="Перетащить блок"
      >
        <h2 className="recipe-steps__title">{node.attrs.title || 'Пошаговое приготовление'}</h2>
      </div>
      <NodeViewContent className="recipe-steps__content" />
    </NodeViewWrapper>
  )
}
