'use client'

import React from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { LogOut, Trash2 } from 'lucide-react'

export function RecipeStepsView({ node, deleteNode, editor, getPos }: NodeViewProps) {
  const updateTitle = (value: string) => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    const tr = editor.state.tr.setNodeMarkup(pos, undefined, { title: value })
    editor.view.dispatch(tr)
  }

  const exitBlock = () => {
    editor.commands.exitRecipeSteps()
    editor.commands.focus()
  }

  return (
    <NodeViewWrapper as="section" className="recipe-steps" data-recipe-steps>
      <div className="recipe-steps__header" contentEditable={false}>
        <input
          className="recipe-steps__title"
          value={node.attrs.title || ''}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Пошаговое приготовление"
        />
        <div className="recipe-steps__actions">
          <button
            type="button"
            title="Выйти из пошаговой инструкции"
            onMouseDown={(e) => e.preventDefault()}
            onClick={exitBlock}
          >
            <LogOut className="size-4" />
          </button>
          <button
            type="button"
            title="Удалить блок"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => deleteNode()}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      <NodeViewContent className="recipe-steps__content" />
    </NodeViewWrapper>
  )
}
