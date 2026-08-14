'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

const TOOLBAR_VISIBILITY = 'gallery-image__toolbar'

export function GalleryImageView({ node, deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper as="div" className="gallery-image">
      <img className="gallery-image__img" src={node.attrs.src} alt="" draggable={false} />
      <BlockToolbar onDelete={deleteNode} visibleClassName={TOOLBAR_VISIBILITY} />
    </NodeViewWrapper>
  )
}
