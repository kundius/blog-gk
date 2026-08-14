'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

export function GalleryImageView({ node, editor, getPos, deleteNode }: NodeViewProps) {
  const updateAlt = (value: string) => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    dispatch(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, alt: value }))
  }

  return (
    <NodeViewWrapper as="div" className="gallery-image">
      <img
        className="gallery-image__img"
        src={node.attrs.src}
        alt={node.attrs.alt}
        draggable={false}
      />
      <textarea
        className="gallery-image__alt"
        value={node.attrs.alt ?? ''}
        onChange={(e) => updateAlt(e.target.value)}
        placeholder="Подпись (alt)"
        rows={2}
      />
      <BlockToolbar onDelete={deleteNode} />
    </NodeViewWrapper>
  )
}