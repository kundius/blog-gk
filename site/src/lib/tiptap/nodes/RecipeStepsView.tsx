'use client'

import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps
} from '@tiptap/react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

const TOOLBAR_VISIBILITY =
  '[.group:hover:not(:has(.node-recipeStep:hover))_&]:visible ' +
  '[.group:hover:not(:has(.node-recipeStep:hover))_&]:opacity-100'

export function RecipeStepsView({ deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper
      as="section"
      className="group relative my-4 rounded-[10px] border border-dashed border-border bg-muted/40 p-4 [counter-reset:recipe-step] [.ProseMirror-selectednode_>&]:border-solid [.ProseMirror-selectednode_>&]:border-blue-600 [.ProseMirror-selectednode_>&]:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
    >
      <h2
        className="mb-4 select-none text-xl font-semibold leading-[1.3] text-foreground"
        contentEditable={false}
      >
        Пошаговое приготовление
      </h2>
      <NodeViewContent />
      <BlockToolbar onDelete={deleteNode} visibleClassName={TOOLBAR_VISIBILITY} />
    </NodeViewWrapper>
  )
}
