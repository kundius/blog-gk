'use client'

import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps
} from '@tiptap/react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

const TOOLBAR_VISIBILITY = 'recipe-steps__toolbar'

export function RecipeStepsView({ deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper as="section" className="recipe-steps">
      <h2 className="recipe-steps__title" contentEditable={false}>
        Пошаговое приготовление
      </h2>
      <NodeViewContent />
      <BlockToolbar onDelete={deleteNode} visibleClassName={TOOLBAR_VISIBILITY} />
    </NodeViewWrapper>
  )
}
