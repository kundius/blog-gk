'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

export function GalleryImageView({ node, deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper as="div" className="gallery-image">
      <div className="gallery-image__media">
        <img
          className="gallery-image__img"
          src={node.attrs.src}
          alt={node.attrs.alt}
          draggable={false}
        />
        <div className="gallery-image__toolbar">
          <BlockToolbar onDelete={deleteNode} />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
