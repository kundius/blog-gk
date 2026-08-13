'use client'

import React, { useRef } from 'react'
import { NodeViewWrapper, useEditorState, type NodeViewProps } from '@tiptap/react'
import { NodeSelection } from '@tiptap/pm/state'

export function GalleryImageView({ node, editor, getPos }: NodeViewProps) {
  const getPosRef = useRef(getPos)
  getPosRef.current = getPos

  const directlySelected = useEditorState({
    editor,
    selector: ({ editor }) => {
      const sel = editor.state.selection
      if (!(sel instanceof NodeSelection)) return false
      let pos: number | null = null
      try {
        pos = getPosRef.current() ?? null
      } catch {
        pos = null
      }
      return pos != null && sel.from === pos
    },
    equalityFn: (a, b) => a === b,
  })

  return (
    <NodeViewWrapper
      as="div"
      className="gallery-image"
      data-gallery-image
      data-drag-handle
      draggable
      data-selected={directlySelected ? 'true' : undefined}
    >
      <img src={node.attrs.src} alt="" className="gallery-image__img" />
    </NodeViewWrapper>
  )
}
