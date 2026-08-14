'use client'

import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps
} from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { Plus } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

const TOOLBAR_VISIBILITY = 'recipe-steps__toolbar'

export function RecipeStepsView({ deleteNode, editor, getPos }: NodeViewProps) {
  const addStep = () => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const $pos = state.doc.resolve(pos)
    const stepsNode = $pos.nodeAfter
    if (!stepsNode) return
    const insertAt = pos + stepsNode.nodeSize - 1
    const newStep = state.schema.nodes.recipeStep.create(
      null,
      state.schema.nodes.paragraph.create(),
    )
    const tr = state.tr
    tr.insert(insertAt, newStep)
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 2), 1))
    dispatch(tr.scrollIntoView())
    editor.commands.focus()
  }

  return (
    <NodeViewWrapper as="section" className="recipe-steps">
      <h2 className="recipe-steps__title" contentEditable={false}>
        Пошаговое приготовление
      </h2>
      <NodeViewContent />
      <button
        type="button"
        contentEditable={false}
        title="Добавить шаг"
        onMouseDown={(e) => e.preventDefault()}
        onClick={addStep}
        className="recipe-steps__add"
      >
        <Plus />
        Добавить шаг
      </button>
      <BlockToolbar onDelete={deleteNode} visibleClassName={TOOLBAR_VISIBILITY} />
    </NodeViewWrapper>
  )
}
